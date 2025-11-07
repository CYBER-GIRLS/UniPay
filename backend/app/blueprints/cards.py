from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import VirtualCard, Subscription
from datetime import datetime, timedelta

cards_bp = Blueprint('cards', __name__)

@cards_bp.route('/', methods=['GET'])
@jwt_required()
def get_cards():
    user_id = get_jwt_identity()
    cards = VirtualCard.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        'cards': [card.to_dict() for card in cards]
    }), 200

@cards_bp.route('/', methods=['POST'])
@jwt_required()
def create_card():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    card_type = data.get('card_type', 'standard')
    card_name = data.get('card_name', 'Virtual Card')
    spending_limit = data.get('spending_limit')
    
    card = VirtualCard(
        user_id=user_id,
        card_type=card_type,
        card_name=card_name,
        card_number=VirtualCard.generate_card_number(),
        cvv=VirtualCard.generate_cvv(),
        expiry_date=(datetime.utcnow() + timedelta(days=1095)).date(),
        spending_limit=spending_limit
    )
    
    db.session.add(card)
    db.session.commit()
    
    return jsonify({
        'message': 'Card created successfully',
        'card': card.to_dict(include_sensitive=True)
    }), 201

@cards_bp.route('/<int:card_id>', methods=['GET'])
@jwt_required()
def get_card(card_id):
    user_id = get_jwt_identity()
    card = VirtualCard.query.filter_by(id=card_id, user_id=user_id).first()
    
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    
    return jsonify({'card': card.to_dict(include_sensitive=True)}), 200

@cards_bp.route('/<int:card_id>/freeze', methods=['POST'])
@jwt_required()
def freeze_card(card_id):
    user_id = get_jwt_identity()
    card = VirtualCard.query.filter_by(id=card_id, user_id=user_id).first()
    
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    
    card.is_frozen = True
    db.session.commit()
    
    return jsonify({'message': 'Card frozen successfully', 'card': card.to_dict()}), 200

@cards_bp.route('/<int:card_id>/unfreeze', methods=['POST'])
@jwt_required()
def unfreeze_card(card_id):
    user_id = get_jwt_identity()
    card = VirtualCard.query.filter_by(id=card_id, user_id=user_id).first()
    
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    
    card.is_frozen = False
    db.session.commit()
    
    return jsonify({'message': 'Card unfrozen successfully', 'card': card.to_dict()}), 200

@cards_bp.route('/<int:card_id>/subscriptions', methods=['GET'])
@jwt_required()
def get_card_subscriptions(card_id):
    user_id = get_jwt_identity()
    card = VirtualCard.query.filter_by(id=card_id, user_id=user_id).first()
    
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    
    subscriptions = Subscription.query.filter_by(card_id=card_id).all()
    
    return jsonify({
        'subscriptions': [sub.to_dict() for sub in subscriptions]
    }), 200

@cards_bp.route('/<int:card_id>/subscriptions', methods=['POST'])
@jwt_required()
def add_subscription(card_id):
    user_id = get_jwt_identity()
    card = VirtualCard.query.filter_by(id=card_id, user_id=user_id).first()
    
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    
    data = request.get_json()
    
    subscription = Subscription(
        card_id=card_id,
        service_name=data.get('service_name'),
        service_category=data.get('service_category'),
        amount=data.get('amount'),
        billing_cycle=data.get('billing_cycle', 'monthly'),
        next_billing_date=datetime.fromisoformat(data['next_billing_date']).date() if data.get('next_billing_date') else None
    )
    
    db.session.add(subscription)
    db.session.commit()
    
    return jsonify({
        'message': 'Subscription added successfully',
        'subscription': subscription.to_dict()
    }), 201
