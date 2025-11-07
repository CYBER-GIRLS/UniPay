from datetime import datetime
from app.extensions import db
import random
import string

class VirtualCard(db.Model):
    __tablename__ = 'virtual_cards'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    card_type = db.Column(db.String(20), default='standard')
    card_number = db.Column(db.String(16), unique=True, nullable=False)
    card_name = db.Column(db.String(100))
    
    cvv = db.Column(db.String(3))
    expiry_date = db.Column(db.Date)
    
    spending_limit = db.Column(db.Numeric(10, 2))
    is_active = db.Column(db.Boolean, default=True)
    is_frozen = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    subscriptions = db.relationship('Subscription', backref='card', lazy='dynamic', cascade='all, delete-orphan')
    
    @staticmethod
    def generate_card_number():
        return ''.join([str(random.randint(0, 9)) for _ in range(16)])
    
    @staticmethod
    def generate_cvv():
        return ''.join([str(random.randint(0, 9)) for _ in range(3)])
    
    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'card_type': self.card_type,
            'card_name': self.card_name,
            'card_number_last4': self.card_number[-4:] if self.card_number else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'spending_limit': float(self.spending_limit) if self.spending_limit else None,
            'is_active': self.is_active,
            'is_frozen': self.is_frozen,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_sensitive:
            data['card_number'] = self.card_number
            data['cvv'] = self.cvv
        
        return data
