# UniPay - Smart Student Digital Wallet

## Overview
UniPay is a digital wallet application tailored for students, integrating financial services with lifestyle features. Its primary goal is to offer secure digital payments, subscription management, student discounts, savings goal tracking, and peer-to-peer lending and marketplace functionalities. The project aims to become an essential financial tool for students, providing convenience, security, and customized benefits, with a vision to enhance financial literacy and independence among students.

## Recent Changes

### November 9, 2025 - Transaction System & Frontend Notifications Completion
- **Balance Validation**: All payment operations now validate wallet balance before processing
- **Race Condition Protection**: SQLAlchemy `.with_for_update()` row locking prevents concurrent overdrafts
- **Comprehensive Transaction Recording**: All operations create detailed transaction records with metadata
- **New Backend Endpoints**:
  - `POST /api/savings/pockets/<id>/withdraw`: Withdraw from savings with balance validation
  - `POST /api/cards/<id>/pay`: Process card payments with freeze/limit checks
- **Updated Backend Endpoints**:
  - `POST /api/marketplace/orders`: Now validates buyer balance, creates dual transactions (purchase/sale), immediate escrow release
  - `POST /api/loans/`: Validates lender balance, creates dual transactions (disbursement/received), debits lender and credits borrower
  - `POST /api/loans/<id>/repay`: Validates borrower balance, creates dual transactions (repayment/repayment_received)
  - `GET /api/transactions/stats`: Includes all 15+ transaction types in income/expense calculations
- **Transaction Types**: Supports 15+ types including savings_deposit, savings_withdrawal, card_payment, purchase, sale, loan_disbursement, loan_received, loan_repayment, loan_repayment_received, budget_allocation, budget_expense, budget_withdrawal
- **Error Handling**: Proper HTTP codes (400 for validation errors, 403 for authorization, 404 for not found, 500 for system errors)
- **Transaction Metadata**: All transactions include contextual data (pocket_id, card_id, order_id, loan_id, merchant, etc.) for analytics and reconciliation
- **Frontend Notifications**: Complete toast notification system for all features:
  - `DarkDaysPocketPage`: Withdrawal mutation with success/error toasts, query invalidation for wallet/pockets
  - Cards, Marketplace, Loans already have comprehensive toast notifications
  - All mutations properly invalidate queries to keep UI synchronized
- **Transaction Filters Enhanced**: `CollapsibleTransactionList` now categorizes all 15+ transaction types:
  - **Income (9 types)**: topup, income, refund, transfer_received, loan_repayment_received, loan_received, savings_withdrawal, sale, budget_withdrawal
  - **Expenses (9 types)**: payment, purchase, transfer_sent, card_payment, loan_disbursement, loan_repayment, savings_deposit, budget_allocation, budget_expense
  - Maintains backward compatibility with legacy 'transfer' type

### November 9, 2025 - PIN Management Feature
- **Default PIN System**: All user accounts now have default PIN '1234' (existing accounts migrated via `set_default_pins.py`)
- **PIN Security**: Users can securely change their PIN through Profile page with password verification
- **Security Warning**: Visual alerts (pulsing badge + warning message) when user still has default PIN
- **Backend Endpoints**: 
  - `POST /api/auth/change-pin`: Secure PIN change with password verification, prevents default PIN usage
  - `GET /api/auth/check-default-pin`: Returns PIN status for UI warnings
  - `POST /api/auth/set-pin`: Restricted to initial PIN setup only (new users without PIN)
- **Frontend Components**: 
  - `ChangePinDialog`: Modal for PIN changes with validation, password verification, and user feedback
  - `ProfilePage`: Security PIN section integrated into Security Settings card
- **Security Model**: 
  - Initial PIN setup via `/auth/set-pin` (no password required for new users)
  - PIN changes via `/auth/change-pin` (requires password verification)
  - Prevents password-less PIN changes for existing users (blocks JWT token attacks)

## User Preferences
No specific user preferences recorded yet. This section will be updated as development progresses.

## System Architecture

UniPay is structured as a single-page application (SPA) with a clear separation between its backend and frontend components.

### UI/UX Decisions
The frontend features a modern, Revolut-inspired interface, built with `shadcn/ui` (Radix UI, Tailwind CSS). Key design elements include a fixed top navigation, responsive navigation (desktop sidebar, mobile bottom nav), a modern color palette with violet/indigo gradients and pastel accents, card-based layouts with shadows and rounded corners, Framer Motion for animations, and a gradient balance card with quick action buttons. `DashboardLayout` is used for authenticated users and `AuthLayout` for unauthenticated users.

### Technical Implementations

*   **Backend:** Developed using Flask (Python), employing SQLAlchemy for ORM (PostgreSQL), Flask-JWT-Extended for authentication, and Flask-SocketIO for real-time features. It utilizes an Application Factory Pattern and Flask Blueprints for modularity, incorporating security measures like JWT, password hashing, PIN protection, and CORS.
*   **Frontend:** Built with React 18 and Vite. State management is handled by Zustand (client-side, authentication) and TanStack Query (server-side data). Axios manages HTTP requests with JWT interceptors, and React Router DOM handles navigation.
*   **Feature Specifications:**
    *   **Authentication:** User registration, login, JWT token management, PIN setup, and visual-only forgot password and social login features.
    *   **Wallet:** Balance display, top-up functionality, peer-to-peer transfers, and visual multi-currency support with transfer scheduling.
    *   **Transactions:** Comprehensive tracking, filtering, and statistical analysis. Includes support for "expected payments" with CRUD operations and recurring instance generation.
    *   **Virtual Cards:** Creation, management (freeze/unfreeze), and linking to subscriptions.
    *   **Subscriptions:** Management of recurring payments.
    *   **Savings:** Secure, PIN-protected savings pockets with auto-save options and goal tracking.
    *   **Marketplace:** Student-to-student commerce platform supporting listings and escrow services.
    *   **P2P Lending:** Functionality for loan requests, debt tracking, and repayment.
    *   **ISIC Discounts:** Integration to provide student card-based discounts.
    *   **Security Settings:** PIN management with default PIN detection and change functionality (password-verified), visual-only features for email verification, two-factor authentication, active sessions management, rate limiting, and session timeout.

### System Design Choices

*   **Database Schema:** Core entities include Users, Wallets, Transactions (with `status='scheduled'` for expected payments), VirtualCards, Subscriptions, SavingsPockets, Goals, Marketplace Listings & Orders, Loans & Repayments, and ISIC-related models.
*   **API Design:** A RESTful API with logically organized endpoints (e.g., `/api/auth`, `/api/wallet`, `/api/expected-payments`).
*   **Development Workflow:** Supports concurrent backend (Python) and frontend (Node.js) development, with proxying for API requests. Database migrations are managed using Flask-Migrate (Alembic).

## External Dependencies

*   **Database:** PostgreSQL (Replit's built-in service)
*   **Backend Framework:** Flask (Python)
*   **Frontend Framework:** React 18
*   **Authentication:** Flask-JWT-Extended
*   **Real-time Communication:** Flask-SocketIO
*   **ORM:** SQLAlchemy with Flask-SQLAlchemy
*   **Database Migrations:** Flask-Migrate (Alembic)
*   **CORS Management:** Flask-CORS
*   **Frontend Build Tool:** Vite
*   **Routing:** React Router DOM
*   **State Management:** Zustand, TanStack Query
*   **HTTP Client:** Axios
*   **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
*   **Form Management & Validation:** React Hook Form, Zod
*   **Animations:** Framer Motion
*   **Date Calculations:** `python-dateutil` (backend)