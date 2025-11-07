# UniPay - Smart Student Digital Wallet

## Project Overview

UniPay is a comprehensive digital wallet application designed specifically for students. It combines essential financial services with lifestyle-oriented features like subscriptions management, student discounts, savings goals, and peer-to-peer lending.

**Current Status:** MVP Foundation Scaffolded
**Last Updated:** November 7, 2025

## Tech Stack

### Backend
- **Framework:** Flask (Python)
- **Database:** PostgreSQL
- **Authentication:** Flask-JWT-Extended (JWT tokens)
- **Real-time:** Flask-SocketIO
- **ORM:** SQLAlchemy with Flask-SQLAlchemy
- **Migrations:** Flask-Migrate (Alembic)
- **API Security:** Flask-CORS

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **State Management:** 
  - Zustand (client state, authentication)
  - TanStack Query (server state, caching)
- **HTTP Client:** Axios
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **Forms:** React Hook Form + Zod validation

## Project Structure

```
UniPay/
├── backend/                      # Flask backend application
│   ├── app/
│   │   ├── __init__.py          # Application factory
│   │   ├── blueprints/          # API route blueprints
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── wallet.py        # Wallet operations
│   │   │   ├── transactions.py  # Transaction history
│   │   │   ├── cards.py         # Virtual cards & subscriptions
│   │   │   ├── savings.py       # Savings pockets & goals
│   │   │   ├── marketplace.py   # Student marketplace
│   │   │   └── loans.py         # P2P lending
│   │   ├── models/              # SQLAlchemy database models
│   │   │   ├── user.py
│   │   │   ├── wallet.py
│   │   │   ├── transaction.py
│   │   │   ├── virtual_card.py
│   │   │   ├── subscription.py
│   │   │   ├── savings_pocket.py
│   │   │   ├── goal.py
│   │   │   ├── marketplace.py
│   │   │   └── loan.py
│   │   ├── schemas/             # Request/response validation
│   │   ├── services/            # Business logic layer
│   │   ├── utils/               # Helper functions
│   │   └── extensions.py        # Flask extensions
│   ├── config.py                # Configuration settings
│   ├── run.py                   # Application entry point
│   └── migrations/              # Database migrations
│
├── src/                         # React frontend application
│   ├── features/                # Feature-based modules
│   │   ├── auth/               # Login, Register, PIN
│   │   ├── dashboard/          # Main dashboard
│   │   ├── wallet/             # Wallet operations
│   │   ├── cards/              # Virtual cards
│   │   ├── transactions/       # Transaction history
│   │   ├── savings/            # Savings & goals
│   │   ├── marketplace/        # Student marketplace
│   │   └── loans/              # P2P lending
│   ├── layouts/                # Layout components
│   │   ├── AuthLayout.tsx      # Public pages layout
│   │   └── DashboardLayout.tsx # Protected pages layout
│   ├── components/             # Shared UI components
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                    # Utilities and configuration
│   │   ├── api.ts             # API client & endpoints
│   │   ├── queryClient.ts     # React Query config
│   │   └── utils.ts           # Helper functions
│   ├── store/                  # Zustand stores
│   │   └── authStore.ts       # Authentication state
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript types
│   ├── App.tsx                # Root component
│   └── main.tsx               # Application entry
│
└── public/                     # Static assets
```

## Database Schema

### Core Entities

**Users**
- User authentication and profile
- Relationships: 1 Wallet, many Transactions, Cards, Goals, Listings

**Wallets**
- User balance and currency
- One-to-one with User

**Transactions**
- All financial operations (topup, transfer, payment)
- References: sender, receiver, card

**VirtualCards**
- Digital payment cards for spending management
- Relationships: many Subscriptions

**Subscriptions**
- Recurring service payments linked to cards
- Auto-renew and billing cycle tracking

**SavingsPockets**
- Secure savings with auto-save features
- PIN-protected withdrawals

**Goals**
- Savings goals with progress tracking
- Gamification support

**Marketplace Listings & Orders**
- Student-to-student commerce
- Escrow payment system

**Loans & Repayments**
- P2P lending with debt tracking
- Automatic reminders

## Architecture

### Backend Architecture

**Application Factory Pattern:**
```python
from flask import Flask
from config import config

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(wallet_bp, url_prefix='/api/wallet')
    # ... more blueprints
    
    return app
```

**Blueprint Structure:**
- Each feature has its own blueprint (auth, wallet, cards, etc.)
- URL prefix: `/api/<feature>`
- RESTful endpoint conventions

**Security:**
- JWT-based authentication
- Password hashing with Werkzeug
- PIN protection for sensitive operations
- CORS configuration for frontend
- SQL injection prevention via ORM

### Frontend Architecture

**Component Organization:**
- Feature-based structure (auth, wallet, cards, etc.)
- Each feature has pages, components, and hooks
- Shared components in `components/ui/`

**State Management:**
- **Zustand:** User authentication state (persisted)
- **TanStack Query:** Server state, caching, and mutations
- **React Hook Form:** Form state and validation

**Routing:**
- Public routes: `/login`, `/register`
- Protected routes: `/dashboard`, `/wallet`, `/cards`, etc.
- Automatic redirect based on authentication status

**API Communication:**
```typescript
// Centralized API client with interceptors
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - User login
- `GET /me` - Get current user
- `POST /set-pin` - Set security PIN
- `POST /verify-pin` - Verify PIN

### Wallet (`/api/wallet`)
- `GET /` - Get wallet balance
- `POST /topup` - Add funds
- `POST /transfer` - Send money to another user

### Transactions (`/api/transactions`)
- `GET /` - List transactions (paginated)
- `GET /<id>` - Get transaction details
- `GET /stats` - Get transaction statistics

### Cards (`/api/cards`)
- `GET /` - List virtual cards
- `POST /` - Create new card
- `GET /<id>` - Get card details
- `POST /<id>/freeze` - Freeze card
- `POST /<id>/unfreeze` - Unfreeze card
- `GET /<id>/subscriptions` - Get card subscriptions
- `POST /<id>/subscriptions` - Add subscription

### Savings (`/api/savings`)
- `GET /pockets` - List savings pockets
- `POST /pockets` - Create savings pocket
- `POST /pockets/<id>/deposit` - Deposit to pocket
- `GET /goals` - List savings goals
- `POST /goals` - Create goal
- `POST /goals/<id>/contribute` - Contribute to goal

### Marketplace (`/api/marketplace`)
- `GET /listings` - Browse listings
- `POST /listings` - Create listing
- `GET /listings/<id>` - Get listing details
- `POST /orders` - Create order (escrow)

### Loans (`/api/loans`)
- `GET /` - Get loans (given & taken)
- `POST /` - Create loan request
- `POST /<id>/repay` - Make repayment

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL database (automatically configured)

### Environment Variables
The following are automatically configured in Replit:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Flask secret key
- `JWT_SECRET_KEY` - JWT token secret

### Running the Application

**Backend (Port 8000):**
```bash
cd backend
python run.py
```

**Frontend (Port 5000):**
```bash
npm run dev
```

Both workflows are configured to start automatically.

### Database Initialization

Database tables are created automatically on first run. To manually initialize:

```bash
cd backend
python -c "from app import create_app; from app.extensions import db; app = create_app(); app.app_context().push(); db.create_all()"
```

### Database Migrations

```bash
cd backend
flask db init                 # First time only
flask db migrate -m "message" # Create migration
flask db upgrade              # Apply migration
```

## Feature Implementation Roadmap

### ✅ Completed (MVP Foundation)
- Backend application structure with blueprints
- Database models for all core entities
- Authentication system (register, login, JWT)
- Wallet operations (balance, topup, transfer)
- Transaction tracking
- Virtual cards management
- Subscriptions system
- Savings pockets & goals
- Marketplace foundation
- P2P lending system
- Frontend routing and layouts
- Authentication pages
- Dashboard page
- API client layer
- State management setup

### 🚧 Next Steps (Feature Development)

#### Phase 1: Core Wallet Features
1. **Wallet Pages**
   - Top-up interface with payment method selection
   - Transfer interface with user search
   - Transaction history with filtering
   
2. **Transaction Management**
   - Finance timeline (calendar view)
   - Advanced filtering and search
   - Export transactions

#### Phase 2: Advanced Features
3. **Virtual Cards & Subscriptions**
   - Card management interface
   - Subscription catalog (Netflix, Spotify, etc.)
   - Payment notifications
   - Failed payment handling

4. **DarkDays Pocket**
   - Secure wallet interface
   - Auto-save configuration
   - Emergency unlock
   - Savings analytics

5. **Piggy Goals**
   - Goal creation wizard
   - Progress visualization
   - Gamification (confetti effects)
   - Multiple active goals

#### Phase 3: Social & Marketplace
6. **Student Marketplace**
   - Listing creation and browsing
   - Search and filters (university, faculty, course)
   - Escrow payment flow
   - Seller/buyer ratings

7. **P2P Lending**
   - Loan request via QR/username
   - Debt tracker dashboard
   - Automatic reminders
   - Repayment history

#### Phase 4: Enhancements
8. **ISIC Integration**
   - Student profile linking
   - Discount detection (NFC, domain, merchant name)
   - Partner catalog
   - Discount notifications

9. **Real-time Features**
   - WebSocket integration for live transfers
   - Push notifications
   - Real-time balance updates

10. **Security Enhancements**
    - Two-factor authentication
    - Biometric authentication
    - Transaction limits
    - Fraud detection

## Development Guidelines

### Backend Best Practices
- Use blueprints for feature separation
- Implement business logic in services layer
- Use SQLAlchemy models with type hints
- Validate input with schemas
- Return consistent JSON responses
- Use proper HTTP status codes
- Log errors and important events

### Frontend Best Practices
- Follow feature-based organization
- Use TypeScript for type safety
- Implement proper error handling
- Use TanStack Query for server state
- Optimize with lazy loading
- Implement loading and error states
- Use shadcn/ui components consistently

### Code Style
- **Backend:** PEP 8, type hints, docstrings
- **Frontend:** ESLint, Prettier, TypeScript strict mode
- Meaningful variable and function names
- Comments for complex logic

## Testing Strategy

### Backend Testing
- Unit tests for models and services
- Integration tests for API endpoints
- Test authentication flows
- Test database operations

### Frontend Testing
- Component unit tests (Vitest)
- Integration tests for user flows
- E2E tests for critical paths
- Accessibility testing

## Deployment

### Production Considerations
- Set environment variables securely
- Use production database
- Enable HTTPS
- Configure CORS properly
- Set up error monitoring
- Implement rate limiting
- Use production builds
- Configure CDN for static assets

## User Preferences

No specific user preferences recorded yet. This section will be updated as development progresses.

## Recent Changes

**November 7, 2025:**
- Initial project scaffolding complete
- Backend Flask application with all blueprints created
- Database models for all features defined
- Frontend React application with routing setup
- Authentication flow implemented (login/register)
- Dashboard page created with wallet overview
- API client layer configured with Axios and TanStack Query
- State management setup with Zustand
- Workflows configured for concurrent backend and frontend development
- PostgreSQL database initialized with all tables

## Notes

- The project uses the built-in Replit PostgreSQL database
- Both backend (port 8000) and frontend (port 5000) run concurrently
- Frontend proxies `/api` requests to backend
- JWT tokens are stored in localStorage and automatically attached to requests
- All sensitive operations require PIN verification
- Database migrations should be used for schema changes in production
