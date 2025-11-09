from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Transaction
from datetime import datetime

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('', methods=['GET'])
@transactions_bp.route('/', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = int(get_jwt_identity())
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    transaction_type = request.args.get('type')
    
    query = Transaction.query.filter_by(user_id=user_id)
    
    if transaction_type:
        query = query.filter_by(transaction_type=transaction_type)
    
    query = query.order_by(Transaction.created_at.desc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    transactions = [t.to_dict() for t in pagination.items]
    
    return jsonify({
        'transactions': transactions,
        'total': pagination.total,
        'page': page,
        'pages': pagination.pages,
        'per_page': per_page
    }), 200

@transactions_bp.route('/<int:transaction_id>', methods=['GET'])
@jwt_required()
def get_transaction(transaction_id):
    user_id = int(get_jwt_identity())
    
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    return jsonify({'transaction': transaction.to_dict()}), 200

@transactions_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_transaction_stats():
    user_id = int(get_jwt_identity())
    
    from sqlalchemy import func, or_
    from app.extensions import db
    
    # Calculate total income: topup, income, refund, and received transfers
    total_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        or_(
            Transaction.transaction_type.in_(['topup', 'income', 'refund']),
            db.and_(
                Transaction.transaction_type == 'transfer',
                Transaction.receiver_id == user_id
            )
        )
    ).scalar() or 0
    
    # Calculate total expenses: payment, purchase, and sent transfers
    total_expenses = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        or_(
            Transaction.transaction_type.in_(['payment', 'purchase']),
            db.and_(
                Transaction.transaction_type == 'transfer',
                Transaction.sender_id == user_id
            )
        )
    ).scalar() or 0
    
    recent_transactions = Transaction.query.filter_by(user_id=user_id).order_by(
        Transaction.created_at.desc()
    ).limit(5).all()
    
    return jsonify({
        'total_income': float(total_income),
        'total_expenses': float(total_expenses),
        'recent_transactions': [t.to_dict() for t in recent_transactions]
    }), 200
