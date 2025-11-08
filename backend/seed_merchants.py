from app import create_app
from app.extensions import db
from app.models.merchant import Merchant

def seed_merchants():
    app = create_app()
    
    with app.app_context():
        existing = Merchant.query.count()
        if existing > 0:
            print(f"Merchants already seeded ({existing} found). Skipping...")
            return
        
        merchants = [
            {
                'name': 'KFC',
                'category': 'Food',
                'logo_url': '🍗',
                'discount_percentage': 15.0,
                'discount_description': '15% off on all meals',
                'online_domain': 'kfc.com',
                'online_url_patterns': ['kfc.com', 'order.kfc.com'],
                'pos_merchant_id': 'KFC_POS_001',
                'nfc_enabled': True,
                'auto_apply_online': True,
                'requires_verification': False
            },
            {
                'name': "McDonald's",
                'category': 'Food',
                'logo_url': '🍔',
                'discount_percentage': 10.0,
                'discount_description': '10% off on all orders',
                'online_domain': 'mcdonalds.com',
                'online_url_patterns': ['mcdonalds.com', 'order.mcdonalds.com'],
                'pos_merchant_id': 'MCD_POS_001',
                'nfc_enabled': True,
                'auto_apply_online': True,
                'requires_verification': False
            },
            {
                'name': 'Starbucks',
                'category': 'Food',
                'logo_url': '☕',
                'discount_percentage': 12.0,
                'discount_description': '12% off on all beverages',
                'online_domain': 'starbucks.com',
                'online_url_patterns': ['starbucks.com', 'app.starbucks.com'],
                'pos_merchant_id': 'SBX_POS_001',
                'nfc_enabled': True,
                'auto_apply_online': False,
                'requires_verification': True
            },
            {
                'name': 'Subway',
                'category': 'Food',
                'logo_url': '🥪',
                'discount_percentage': 8.0,
                'discount_description': '8% off on subs and salads',
                'online_domain': 'subway.com',
                'online_url_patterns': ['subway.com', 'order.subway.com'],
                'pos_merchant_id': 'SUB_POS_001',
                'nfc_enabled': True,
                'auto_apply_online': True,
                'requires_verification': False
            },
            {
                'name': 'University Bookstore',
                'category': 'Retail',
                'logo_url': '📚',
                'discount_percentage': 20.0,
                'discount_description': '20% off on textbooks',
                'online_domain': 'campusbooks.com',
                'online_url_patterns': ['campusbooks.com', 'universitybookstore.com'],
                'pos_merchant_id': 'BOOK_POS_001',
                'nfc_enabled': True,
                'auto_apply_online': True,
                'requires_verification': True
            },
            {
                'name': 'TechHub Electronics',
                'category': 'Retail',
                'logo_url': '💻',
                'discount_percentage': 15.0,
                'discount_description': '15% off on laptops and accessories',
                'online_domain': 'techhub.com',
                'online_url_patterns': ['techhub.com', 'shop.techhub.com'],
                'pos_merchant_id': 'TECH_POS_001',
                'nfc_enabled': False,
                'auto_apply_online': True,
                'requires_verification': False
            },
            {
                'name': 'Nike',
                'category': 'Sports',
                'logo_url': '👟',
                'discount_percentage': 10.0,
                'discount_description': '10% off on all sportswear',
                'online_domain': 'nike.com',
                'online_url_patterns': ['nike.com', 'store.nike.com'],
                'pos_merchant_id': 'NIKE_POS_001',
                'nfc_enabled': True,
                'auto_apply_online': False,
                'requires_verification': True
            },
            {
                'name': 'FitZone Gym',
                'category': 'Sports',
                'logo_url': '🏋️',
                'discount_percentage': 25.0,
                'discount_description': '25% off on monthly membership',
                'online_domain': 'fitzone.com',
                'online_url_patterns': ['fitzone.com', 'join.fitzone.com'],
                'pos_merchant_id': 'FIT_POS_001',
                'nfc_enabled': False,
                'auto_apply_online': True,
                'requires_verification': True
            },
            {
                'name': 'Coursera',
                'category': 'Education',
                'logo_url': '🎓',
                'discount_percentage': 30.0,
                'discount_description': '30% off on annual subscription',
                'online_domain': 'coursera.org',
                'online_url_patterns': ['coursera.org', 'www.coursera.org'],
                'pos_merchant_id': None,
                'nfc_enabled': False,
                'auto_apply_online': True,
                'requires_verification': False
            },
            {
                'name': 'Spotify',
                'category': 'Entertainment',
                'logo_url': '🎵',
                'discount_percentage': 50.0,
                'discount_description': '50% off Student Premium',
                'online_domain': 'spotify.com',
                'online_url_patterns': ['spotify.com', 'accounts.spotify.com'],
                'pos_merchant_id': None,
                'nfc_enabled': False,
                'auto_apply_online': True,
                'requires_verification': True
            },
            {
                'name': 'CineWorld',
                'category': 'Entertainment',
                'logo_url': '🎬',
                'discount_percentage': 20.0,
                'discount_description': '20% off on movie tickets',
                'online_domain': 'cineworld.com',
                'online_url_patterns': ['cineworld.com', 'tickets.cineworld.com'],
                'pos_merchant_id': 'CINE_POS_001',
                'nfc_enabled': True,
                'auto_apply_online': True,
                'requires_verification': False
            },
            {
                'name': 'City Museum',
                'category': 'Entertainment',
                'logo_url': '🏛️',
                'discount_percentage': 15.0,
                'discount_description': '15% off on entry tickets',
                'online_domain': 'citymuseum.org',
                'online_url_patterns': ['citymuseum.org', 'tickets.citymuseum.org'],
                'pos_merchant_id': 'MUS_POS_001',
                'nfc_enabled': False,
                'auto_apply_online': False,
                'requires_verification': True
            },
            {
                'name': 'H&M',
                'category': 'Retail',
                'logo_url': '👕',
                'discount_percentage': 12.0,
                'discount_description': '12% off on clothing',
                'online_domain': 'hm.com',
                'online_url_patterns': ['hm.com', 'www2.hm.com'],
                'pos_merchant_id': 'HM_POS_001',
                'nfc_enabled': True,
                'auto_apply_online': True,
                'requires_verification': False
            },
            {
                'name': 'Amazon Student',
                'category': 'Retail',
                'logo_url': '📦',
                'discount_percentage': 10.0,
                'discount_description': '10% off + Prime benefits',
                'online_domain': 'amazon.com',
                'online_url_patterns': ['amazon.com', 'www.amazon.com', 'smile.amazon.com'],
                'pos_merchant_id': None,
                'nfc_enabled': False,
                'auto_apply_online': True,
                'requires_verification': True
            },
            {
                'name': 'Campus Transit',
                'category': 'Transport',
                'logo_url': '🚌',
                'discount_percentage': 25.0,
                'discount_description': '25% off on monthly bus pass',
                'online_domain': 'campustransit.com',
                'online_url_patterns': ['campustransit.com', 'tickets.campustransit.com'],
                'pos_merchant_id': 'BUS_POS_001',
                'nfc_enabled': True,
                'auto_apply_online': True,
                'requires_verification': True
            }
        ]
        
        for merchant_data in merchants:
            merchant = Merchant(**merchant_data)
            db.session.add(merchant)
        
        db.session.commit()
        print(f"✅ Successfully seeded {len(merchants)} merchants!")

if __name__ == '__main__':
    seed_merchants()
