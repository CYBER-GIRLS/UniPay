# UniPay - Smart Student Digital Wallet

## Overview
UniPay is a digital wallet application tailored for students, integrating financial services with lifestyle features. Its primary goal is to offer secure digital payments, subscription management, student discounts, savings goal tracking, and peer-to-peer lending and marketplace functionalities. The project aims to become an essential financial tool for students, providing convenience, security, and customized benefits, with a vision to enhance financial literacy and independence among students.

## Recent Changes

### November 9, 2025 - Dynamic Milestone Progress Calculation
- **Issue**: Progress percentage toward savings goal was fixed at 75%, not reflecting actual savings
- **Root Cause**: DarkDaysCard component had hardcoded progress bar width and percentage text
- **Fix Applied**:
  - Added `goal_amount` optional field to DarkDaysCard pocket interface (defaults to $5000)
  - Calculate dynamic progress: `Math.min((balance / goalAmount) * 100, 100)`
  - Progress bar width animates to actual percentage: `animate={{ width: ${progressPercentage}% }}`
  - Percentage text updates dynamically: `{progressPercentage.toFixed(0)}% to goal`
  - Added goal and remaining amount display below progress bar
  - Remaining amount calculation: `Math.max(goalAmount - balance, 0)`
- **Impact**: Progress now accurately reflects actual savings vs target in real-time
- **User Experience**: 
  - Users see accurate progress (e.g., $250 saved toward $5000 goal shows 5%, not 75%)
  - Progress updates immediately after deposits or withdrawals
  - Goal and remaining amounts visible for better financial planning
  - Progress bar fills to 100% when goal is reached

### November 9, 2025 - DarkDays Pocket Dialog Scrolling Fix
- **Issue**: Emergency Access and Security Verification dialogs content overflowing on smaller screens or when content is tall
- **Root Cause**: Dialogs had no max-height constraint and overflow handling, causing content to be cut off beyond viewport
- **Fix Applied**: 
  - Added `max-h-[90vh]` to all DarkDays Pocket dialogs for viewport-relative height constraint
  - Added `flex flex-col` layout to EmergencyUnlockDialog and SecurityVerificationModal
  - Added `overflow-y-auto` and `flex-1` to scrollable content areas with `pr-2` for scrollbar padding
  - Made headers `flex-shrink-0` to prevent compression
  - Made action buttons `flex-shrink-0` with `border-t` separator to keep them fixed at bottom
  - Updated Create Pocket, Deposit, and Withdrawal Amount dialogs with `max-h-[90vh] overflow-y-auto`
- **Impact**: All dialogs now properly fit within viewport (90% max height) with smooth scrolling on all screen sizes
- **User Experience**: Users can now see all fields, explanations, and buttons without content being cut off, with consistent scrolling behavior

### November 9, 2025 - DarkDays Pocket Complete Feature Implementation
- **Withdrawal Amount Input Dialog**: Added gated withdrawal flow requiring amount input before security verification
- **Auto-Save Backend Integration**: Connected frontend auto-save configuration panel to `/api/savings/pockets/<id>/auto-save` endpoint
- **Emergency Metadata Tracking**: Withdrawal transactions now store emergency category, reason, and `is_emergency_withdrawal` flag in metadata
- **Currency Display Fix**: Toast notifications now correctly display original user-entered amounts (e.g., €100) instead of USD-converted values (e.g., €110)
- **Complete Withdrawal Flow**: Emergency category → Amount input (with validation) → Security verification (PIN + Password + Confirmation) → Backend processing with metadata
- **Transaction Audit Trail**: All emergency withdrawals marked in transaction metadata with category (medical/travel/family/crisis) and user-provided reason
- **Backend Emergency Support**: `/api/savings/pockets/<id>/withdraw` accepts optional `emergencyData` parameter and stores in transaction metadata
- **API Type Updates**: TypeScript signatures updated to support `emergencyData?: any` parameter in withdrawal operations

### November 9, 2025 - Budget Card Error Notification Fix
- **Issue**: Budget card spending errors (insufficient funds) were silently failing without displaying error messages to users
- **Root Cause**: App.tsx was using the wrong Toaster component (shadcn's hook-based system) while all pages used Sonner's function-based toast calls
- **Fix Applied**: Updated `App.tsx` to import and render `Toaster` from `'./components/ui/sonner'` instead of `'./components/ui/toaster'`
- **Impact**: Fixed ALL toast notifications across the entire application (budget cards, marketplace, loans, savings, transfers, etc.)
- **Backend Validation**: Already properly implemented - returns 400 errors with clear messages like "Insufficient budget in {card_name}. Available: ${amount}"
- **Frontend Error Handling**: Already properly implemented - all mutations have `onError` handlers that call `toast.error()`
- **Result**: Users now see clear, visible error notifications when attempting to spend more than available budget in any Budget-type card

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