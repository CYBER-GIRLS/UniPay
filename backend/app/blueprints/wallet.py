from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Wallet, Transaction
from datetime import datetime
from decimal import Decimal

wallet_bp = Blueprint('wallet', __name__)

@wallet_bp.route('/', methods=['GET'])
@jwt_required()
def get_wallet():
    user_id = int(get_jwt_identity())
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    
    if not wallet:
        return jsonify({'error': 'Wallet not found'}), 404
    
    return jsonify({'wallet': wallet.to_dict()}), 200

@wallet_bp.route('/topup', methods=['POST'])
@jwt_required()
def topup_wallet():
    user_id = int(get_jwt_identity())
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    
    if not wallet:
        return jsonify({'error': 'Wallet not found'}), 404
    
    data = request.get_json()
    amount = data.get('amount')
    method = data.get('method', 'bank_transfer')
    
    if not amount or float(amount) <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
    
    wallet.balance += Decimal(str(amount))
    
    transaction = Transaction(
        user_id=user_id,
        transaction_type='topup',
        amount=Decimal(str(amount)),
        status='completed',
        receiver_id=user_id,
        description=f'Top-up via {method}',
        completed_at=datetime.utcnow(),
        transaction_metadata={'method': method}
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({
        'message': 'Wallet topped up successfully',
        'wallet': wallet.to_dict(),
        'transaction': transaction.to_dict()
    }), 200

@wallet_bp.route('/transfer', methods=['POST'])
@jwt_required()
def transfer_money():
    sender_id = int(get_jwt_identity())
    sender_wallet = Wallet.query.filter_by(user_id=sender_id).first()
    
    if not sender_wallet:
        return jsonify({'error': 'Sender wallet not found'}), 404
    
    data = request.get_json()
    receiver_username = data.get('receiver_username')
    amount = data.get('amount')
    description = data.get('description', '')
    
    if not receiver_username or not amount:
        return jsonify({'error': 'Missing required fields'}), 400
    
    amount = Decimal(str(amount))
    
    if amount <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
    
    if sender_wallet.balance < amount:
        return jsonify({'error': 'Insufficient balance'}), 400
    
    receiver = User.query.filter_by(username=receiver_username).first()
    if not receiver:
        return jsonify({'error': 'Receiver not found'}), 404
    
    receiver_wallet = Wallet.query.filter_by(user_id=receiver.id).first()
    if not receiver_wallet:
        return jsonify({'error': 'Receiver wallet not found'}), 404
    
    sender_wallet.balance -= amount
    receiver_wallet.balance += amount
    
    sender_transaction = Transaction(
        user_id=sender_id,
        transaction_type='transfer',
        amount=amount,
        status='completed',
        sender_id=sender_id,
        receiver_id=receiver.id,
        description=description or f'Transfer to {receiver.username}',
        completed_at=datetime.utcnow()
    )
    
    receiver_transaction = Transaction(
        user_id=receiver.id,
        transaction_type='transfer',
        amount=amount,
        status='completed',
        sender_id=sender_id,
        receiver_id=receiver.id,
        description=description or f'Transfer from {sender_wallet.user.username}',
        completed_at=datetime.utcnow()
    )
    
    db.session.add(sender_transaction)
    db.session.add(receiver_transaction)
    db.session.commit()
    
    return jsonify({
        'message': 'Transfer successful',
        'wallet': sender_wallet.to_dict(),
        'transaction': sender_transaction.to_dict()
    }), 200
