from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Loan, LoanRepayment, User, Wallet, Transaction
from datetime import datetime
from decimal import Decimal, InvalidOperation

loans_bp = Blueprint('loans', __name__)

@loans_bp.route('/', methods=['GET'])
@jwt_required()
def get_loans():
    from sqlalchemy.orm import joinedload
    user_id = int(get_jwt_identity())
    
    loans_given = Loan.query.options(
        joinedload(Loan.borrower)
    ).filter_by(lender_id=user_id).all()
    
    loans_taken = Loan.query.options(
        joinedload(Loan.lender)
    ).filter_by(borrower_id=user_id).all()
    
    return jsonify({
        'loans_given': [loan.to_dict() for loan in loans_given],
        'loans_taken': [loan.to_dict() for loan in loans_taken]
    }), 200

@loans_bp.route('/', methods=['POST'])
@jwt_required()
def create_loan():
    lender_id = int(get_jwt_identity())
    data = request.get_json()
    
    borrower_username = data.get('borrower_username')
    
    # Validate amount before conversion
    if not data.get('amount'):
        return jsonify({'error': 'Amount is required'}), 400
    
    try:
        amount_decimal = Decimal(str(data['amount']))
    except (ValueError, TypeError, KeyError, InvalidOperation):
        return jsonify({'error': 'Invalid amount format'}), 400
    
    if amount_decimal <= 0:
        return jsonify({'error': 'Amount must be greater than 0'}), 400
    
    borrower = User.query.filter_by(username=borrower_username).first()
    if not borrower:
        return jsonify({'error': 'Borrower not found'}), 404
    
    # Prevent lending to self
    if borrower.id == lender_id:
        return jsonify({'error': 'Cannot lend to yourself'}), 400
    
    try:
        # Lock lender wallet
        lender_wallet = Wallet.query.filter_by(user_id=lender_id).with_for_update().first()
        if not lender_wallet:
            return jsonify({'error': 'Wallet not found'}), 404
        
        # Check lender balance
        if lender_wallet.balance < amount_decimal:
            return jsonify({'error': 'Insufficient wallet balance to lend this amount'}), 400
        
        # Lock borrower wallet
        borrower_wallet = Wallet.query.filter_by(user_id=borrower.id).with_for_update().first()
        if not borrower_wallet:
            return jsonify({'error': 'Borrower wallet not found'}), 404
        
        # Deduct from lender wallet
        lender_wallet.balance -= amount_decimal
        
        # Credit borrower wallet
        borrower_wallet.balance += amount_decimal
        
        # Create loan record
        loan = Loan(
            lender_id=lender_id,
            borrower_id=borrower.id,
            amount=amount_decimal,
            description=data.get('description'),
            due_date=datetime.fromisoformat(data['due_date']).date() if data.get('due_date') else None,
            interest_rate=data.get('interest_rate', 0.00),
            status='active'
        )
        db.session.add(loan)
        db.session.flush()  # Get loan ID
        
        # Create transaction for lender (money out)
        lender_transaction = Transaction(
            user_id=lender_id,
            transaction_type='loan_disbursement',
            amount=float(amount_decimal),
            status='completed',
            description=f'Loan given to {borrower.username}',
            transaction_metadata={
                'loan_id': loan.id,
                'borrower_id': borrower.id,
                'borrower_username': borrower.username,
                'due_date': data.get('due_date')
            },
            completed_at=datetime.utcnow()
        )
        db.session.add(lender_transaction)
        
        # Create transaction for borrower (money in)
        borrower_transaction = Transaction(
            user_id=borrower.id,
            transaction_type='loan_received',
            amount=float(amount_decimal),
            status='completed',
            description=f'Loan received from {User.query.get(lender_id).username}',
            transaction_metadata={
                'loan_id': loan.id,
                'lender_id': lender_id,
                'due_date': data.get('due_date')
            },
            completed_at=datetime.utcnow()
        )
        db.session.add(borrower_transaction)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Loan disbursed successfully',
            'loan': loan.to_dict(),
            'transaction': lender_transaction.to_dict(),
            'wallet_balance': float(lender_wallet.balance)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Loan creation failed: {str(e)}'}), 500

@loans_bp.route('/<int:loan_id>/repay', methods=['POST'])
@jwt_required()
def repay_loan(loan_id):
    user_id = int(get_jwt_identity())
    
    # Lock loan record
    loan = Loan.query.filter_by(id=loan_id).with_for_update().first()
    
    if not loan:
        return jsonify({'error': 'Loan not found'}), 404
    
    if loan.borrower_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if loan.status == 'repaid':
        return jsonify({'error': 'Loan already fully repaid'}), 400
    
    data = request.get_json()
    
    # Validate amount before Decimal conversion
    if not data.get('amount'):
        return jsonify({'error': 'Amount is required'}), 400
    
    try:
        amount = Decimal(str(data['amount']))
    except (ValueError, TypeError, KeyError, InvalidOperation):
        return jsonify({'error': 'Invalid amount format'}), 400
    
    if amount <= 0:
        return jsonify({'error': 'Amount must be greater than 0'}), 400
    
    # Calculate remaining balance
    remaining = loan.amount - loan.amount_repaid
    if amount > remaining:
        amount = remaining
    
    try:
        # Lock borrower wallet
        borrower_wallet = Wallet.query.filter_by(user_id=user_id).with_for_update().first()
        if not borrower_wallet:
            return jsonify({'error': 'Wallet not found'}), 404
        
        # Check borrower balance
        if borrower_wallet.balance < amount:
            return jsonify({'error': 'Insufficient wallet balance'}), 400
        
        # Lock lender wallet
        lender_wallet = Wallet.query.filter_by(user_id=loan.lender_id).with_for_update().first()
        if not lender_wallet:
            return jsonify({'error': 'Lender wallet not found'}), 404
        
        # Deduct from borrower wallet
        borrower_wallet.balance -= amount
        
        # Credit lender wallet
        lender_wallet.balance += amount
        
        # Update loan amount repaid
        loan.amount_repaid += amount
        
        # Create repayment record
        repayment = LoanRepayment(
            loan_id=loan_id,
            amount=amount
        )
        db.session.add(repayment)
        db.session.flush()  # Get repayment ID
        
        # Create transaction for borrower (money out)
        borrower_transaction = Transaction(
            user_id=user_id,
            transaction_type='loan_repayment',
            amount=float(amount),
            status='completed',
            description=f'Loan repayment to {User.query.get(loan.lender_id).username}',
            transaction_metadata={
                'loan_id': loan.id,
                'repayment_id': repayment.id,
                'lender_id': loan.lender_id,
                'remaining_balance': float(loan.amount - loan.amount_repaid)
            },
            completed_at=datetime.utcnow()
        )
        db.session.add(borrower_transaction)
        
        # Create transaction for lender (money in)
        lender_transaction = Transaction(
            user_id=loan.lender_id,
            transaction_type='loan_repayment_received',
            amount=float(amount),
            status='completed',
            description=f'Loan repayment from {User.query.get(user_id).username}',
            transaction_metadata={
                'loan_id': loan.id,
                'repayment_id': repayment.id,
                'borrower_id': user_id,
                'remaining_balance': float(loan.amount - loan.amount_repaid)
            },
            completed_at=datetime.utcnow()
        )
        db.session.add(lender_transaction)
        
        # Mark loan as fully repaid if complete
        if loan.amount_repaid >= loan.amount:
            loan.is_fully_repaid = True
            loan.repaid_at = datetime.utcnow()
            loan.status = 'repaid'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Repayment successful',
            'loan': loan.to_dict(),
            'repayment': repayment.to_dict(),
            'transaction': borrower_transaction.to_dict(),
            'wallet_balance': float(borrower_wallet.balance)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Repayment failed: {str(e)}'}), 500
