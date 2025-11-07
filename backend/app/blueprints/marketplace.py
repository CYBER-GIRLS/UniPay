from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import MarketplaceListing, MarketplaceOrder

marketplace_bp = Blueprint('marketplace', __name__)

@marketplace_bp.route('/listings', methods=['GET'])
@jwt_required()
def get_listings():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    category = request.args.get('category')
    university = request.args.get('university')
    
    query = MarketplaceListing.query.filter_by(is_available=True, is_sold=False)
    
    if category:
        query = query.filter_by(category=category)
    if university:
        query = query.filter_by(university=university)
    
    query = query.order_by(MarketplaceListing.created_at.desc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'listings': [listing.to_dict() for listing in pagination.items],
        'total': pagination.total,
        'page': page,
        'pages': pagination.pages
    }), 200

@marketplace_bp.route('/listings', methods=['POST'])
@jwt_required()
def create_listing():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    listing = MarketplaceListing(
        seller_id=user_id,
        title=data.get('title'),
        description=data.get('description'),
        category=data.get('category'),
        price=data.get('price'),
        university=data.get('university'),
        faculty=data.get('faculty'),
        course=data.get('course'),
        condition=data.get('condition'),
        images=data.get('images', [])
    )
    
    db.session.add(listing)
    db.session.commit()
    
    return jsonify({
        'message': 'Listing created successfully',
        'listing': listing.to_dict()
    }), 201

@marketplace_bp.route('/listings/<int:listing_id>', methods=['GET'])
@jwt_required()
def get_listing(listing_id):
    listing = MarketplaceListing.query.get(listing_id)
    
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404
    
    return jsonify({'listing': listing.to_dict()}), 200

@marketplace_bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    listing_id = data.get('listing_id')
    listing = MarketplaceListing.query.get(listing_id)
    
    if not listing or not listing.is_available:
        return jsonify({'error': 'Listing not available'}), 400
    
    order = MarketplaceOrder(
        listing_id=listing_id,
        buyer_id=user_id,
        amount=listing.price,
        status='pending'
    )
    
    db.session.add(order)
    db.session.commit()
    
    return jsonify({
        'message': 'Order created successfully',
        'order': order.to_dict()
    }), 201
