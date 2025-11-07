from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Loan, LoanRepayment, User
from datetime import datetime
from decimal import Decimal

loans_bp = Blueprint('loans', __name__)

@loans_bp.route('/', methods=['GET'])
@jwt_required()
def get_loans():
    user_id = int(get_jwt_identity())
    
    loans_given = Loan.query.filter_by(lender_id=user_id).all()
    loans_taken = Loan.query.filter_by(borrower_id=user_id).all()
    
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
    borrower = User.query.filter_by(username=borrower_username).first()
    
    if not borrower:
        return jsonify({'error': 'Borrower not found'}), 404
    
    loan = Loan(
        lender_id=lender_id,
        borrower_id=borrower.id,
        amount=data.get('amount'),
        description=data.get('description'),
        due_date=datetime.fromisoformat(data['due_date']).date() if data.get('due_date') else None,
        interest_rate=data.get('interest_rate', 0.00),
        status='active'
    )
    
    db.session.add(loan)
    db.session.commit()
    
    return jsonify({
        'message': 'Loan created successfully',
        'loan': loan.to_dict()
    }), 201

@loans_bp.route('/<int:loan_id>/repay', methods=['POST'])
@jwt_required()
def repay_loan(loan_id):
    user_id = int(get_jwt_identity())
    loan = Loan.query.get(loan_id)
    
    if not loan:
        return jsonify({'error': 'Loan not found'}), 404
    
    if loan.borrower_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    amount = Decimal(str(data.get('amount')))
    
    if amount <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
    
    if amount > (loan.amount - loan.amount_repaid):
        amount = loan.amount - loan.amount_repaid
    
    loan.amount_repaid += amount
    
    repayment = LoanRepayment(
        loan_id=loan_id,
        amount=amount
    )
    db.session.add(repayment)
    
    if loan.amount_repaid >= loan.amount:
        loan.is_fully_repaid = True
        loan.repaid_at = datetime.utcnow()
        loan.status = 'repaid'
    
    db.session.commit()
    
    return jsonify({
        'message': 'Repayment successful',
        'loan': loan.to_dict(),
        'repayment': repayment.to_dict()
    }), 200
