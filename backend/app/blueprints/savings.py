from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import SavingsPocket, Goal, User
from decimal import Decimal

savings_bp = Blueprint('savings', __name__)

@savings_bp.route('/pockets', methods=['GET'])
@jwt_required()
def get_savings_pockets():
    user_id = get_jwt_identity()
    pockets = SavingsPocket.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        'pockets': [pocket.to_dict() for pocket in pockets]
    }), 200

@savings_bp.route('/pockets', methods=['POST'])
@jwt_required()
def create_savings_pocket():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    pocket = SavingsPocket(
        user_id=user_id,
        name=data.get('name', 'DarkDays Pocket'),
        auto_save_percentage=data.get('auto_save_percentage', 20.00),
        auto_save_frequency=data.get('auto_save_frequency')
    )
    
    db.session.add(pocket)
    db.session.commit()
    
    return jsonify({
        'message': 'Savings pocket created successfully',
        'pocket': pocket.to_dict()
    }), 201

@savings_bp.route('/pockets/<int:pocket_id>/deposit', methods=['POST'])
@jwt_required()
def deposit_to_pocket(pocket_id):
    user_id = get_jwt_identity()
    pocket = SavingsPocket.query.filter_by(id=pocket_id, user_id=user_id).first()
    
    if not pocket:
        return jsonify({'error': 'Savings pocket not found'}), 404
    
    data = request.get_json()
    amount = data.get('amount')
    pin = data.get('pin')
    
    if not amount or float(amount) <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
    
    user = User.query.get(user_id)
    if pocket.pin_protected and not user.check_pin(pin):
        return jsonify({'error': 'Invalid PIN'}), 401
    
    pocket.balance += Decimal(str(amount))
    db.session.commit()
    
    return jsonify({
        'message': 'Deposit successful',
        'pocket': pocket.to_dict()
    }), 200

@savings_bp.route('/goals', methods=['GET'])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()
    goals = Goal.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        'goals': [goal.to_dict() for goal in goals]
    }), 200

@savings_bp.route('/goals', methods=['POST'])
@jwt_required()
def create_goal():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    goal = Goal(
        user_id=user_id,
        title=data.get('title'),
        description=data.get('description'),
        target_amount=data.get('target_amount'),
        target_date=datetime.fromisoformat(data['target_date']).date() if data.get('target_date') else None,
        icon=data.get('icon'),
        color=data.get('color')
    )
    
    db.session.add(goal)
    db.session.commit()
    
    return jsonify({
        'message': 'Goal created successfully',
        'goal': goal.to_dict()
    }), 201

@savings_bp.route('/goals/<int:goal_id>/contribute', methods=['POST'])
@jwt_required()
def contribute_to_goal(goal_id):
    user_id = get_jwt_identity()
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    
    if not goal:
        return jsonify({'error': 'Goal not found'}), 404
    
    data = request.get_json()
    amount = data.get('amount')
    
    if not amount or float(amount) <= 0:
        return jsonify({'error': 'Invalid amount'}), 400
    
    goal.current_amount += Decimal(str(amount))
    
    if goal.current_amount >= goal.target_amount and not goal.is_completed:
        goal.is_completed = True
        goal.completed_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Contribution successful',
        'goal': goal.to_dict(),
        'goal_unlocked': goal.is_completed
    }), 200
