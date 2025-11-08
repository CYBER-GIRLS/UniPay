from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Wallet

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('username'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 400
    
    user = User(
        email=data['email'],
        username=data['username'],
        phone=data.get('phone'),
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        university=data.get('university'),
        faculty=data.get('faculty')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.flush()
    
    wallet = Wallet(user_id=user.id)
    db.session.add(wallet)
    
    db.session.commit()
    
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        current_app.logger.warning(f"Login attempt with missing credentials - data: {bool(data)}, email: {bool(data.get('email') if data else False)}, password: {bool(data.get('password') if data else False)}")
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        current_app.logger.warning(f"Login attempt for non-existent user: {data['email']}")
        return jsonify({'error': 'Invalid email or password'}), 401

    if not user.check_password(data['password']):
        current_app.logger.warning(f"Failed login attempt with invalid password for user: {data['email']}")
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not user.is_active:
        current_app.logger.warning(f"Login attempt for deactivated account: {data['email']}")
        return jsonify({'error': 'Account is deactivated'}), 403
    
    current_app.logger.info(f"Successful login for user: {user.email}")
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/set-pin', methods=['POST'])
@jwt_required()
def set_pin():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    pin = data.get('pin')
    
    if not pin or len(str(pin)) != 4:
        return jsonify({'error': 'PIN must be 4 digits'}), 400
    
    user.set_pin(pin)
    db.session.commit()
    
    return jsonify({'message': 'PIN set successfully'}), 200

@auth_bp.route('/verify-pin', methods=['POST'])
@jwt_required()
def verify_pin():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    pin = data.get('pin')
    
    if user.check_pin(pin):
        return jsonify({'valid': True}), 200
    else:
        return jsonify({'valid': False}), 400
