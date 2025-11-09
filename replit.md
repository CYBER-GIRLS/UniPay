# UniPay - Smart Student Digital Wallet

## Overview

UniPay is a digital wallet application designed for students, integrating financial services with lifestyle features. Its core purpose is to provide secure digital payments, subscription management, student discounts, savings goal tracking, and peer-to-peer lending and marketplace functionalities. The project aims to become an indispensable financial tool for students, offering convenience, security, and tailored benefits.

## User Preferences

No specific user preferences recorded yet. This section will be updated as development progresses.

## System Architecture

UniPay is a single-page application (SPA) with a distinct backend and frontend.

**UI/UX Decisions:**
The frontend adopts a modern, Revolut-inspired interface utilizing `shadcn/ui` (Radix UI, Tailwind CSS). Key design elements include a fixed top navigation, responsive navigation (desktop sidebar, mobile bottom nav), a modern color palette with violet/indigo gradients and pastel accents, card-based layouts with shadows and rounded corners, Framer Motion for animations, and a gradient balance card with quick action buttons. It uses `DashboardLayout` for authenticated users and `AuthLayout` for unauthenticated users.

**Technical Implementations:**
*   **Backend:** Developed with Flask (Python), using SQLAlchemy for ORM (PostgreSQL), Flask-JWT-Extended for authentication, and Flask-SocketIO for real-time features. It employs an Application Factory Pattern and Flask Blueprints for modularity, with security measures including JWT, password hashing, PIN protection, and CORS.
*   **Frontend:** Built with React 18 and Vite. State management is handled by Zustand (client-side, authentication) and TanStack Query (server-side data). Axios is used for HTTP requests with JWT interceptors, and React Router DOM manages navigation.
*   **Feature Specifications:**
    *   **Authentication:** User registration, login, JWT token management, and PIN setup.
    *   **Wallet:** Balance display, top-up functionality, and peer-to-peer transfers.
    *   **Transactions:** Comprehensive tracking, filtering, and statistical analysis.
    *   **Virtual Cards:** Creation, management (freeze/unfreeze), and linking to subscriptions.
    *   **Subscriptions:** Management of recurring payments.
    *   **Savings:** Secure, PIN-protected savings pockets with auto-save options and goal tracking.
    *   **Marketplace:** Student-to-student commerce platform supporting listings and escrow services.
    *   **P2P Lending:** Functionality for loan requests, debt tracking, and repayment.
    *   **ISIC Discounts:** Integration to provide student card-based discounts.

**System Design Choices:**
*   **Database Schema:** Key entities include Users, Wallets, Transactions, VirtualCards, Subscriptions, SavingsPockets, Goals, Marketplace Listings & Orders, Loans & Repayments, and ISIC-related models.
*   **API Design:** A RESTful API organizes endpoints logically by feature (e.g., `/api/auth`, `/api/wallet`).
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

## Recent Changes

**November 9, 2025 (Wallet Feature Review & Documentation Update):**
- ✅ **Backend Verification** - Confirmed all wallet endpoints operational
  - GET /api/wallet returns: id, user_id, balance, currency, is_frozen, updated_at (NOT username)
  - POST /api/wallet/topup validates amount, creates transaction, updates balance
  - POST /api/wallet/transfer implements dual-entry accounting with atomic database transactions
- ✅ **Frontend Bug Fixes** - Corrected TransfersPage implementation errors
  - Fixed username display: Changed from `walletData?.username` to `user?.username` from authStore
  - Fixed transaction filtering: Changed from `type === 'transfer_sent/received'` to `transaction_type === 'transfer'`
  - Fixed transfer direction logic: Implemented `isSent = transfer.user_id === transfer.sender_id` comparison
- ✅ **Documentation Accuracy** - Updated docs/features/02-wallet.md to reflect actual implementation
  - Documented actual wallet API response fields (removed incorrect username field)
  - Clarified transaction_type values ('topup', 'transfer') and dual-entry accounting model
  - Explained transfer direction determination logic (user_id vs sender_id comparison)
  - Corrected cache invalidation behavior description (query invalidation in mounted components)
  - Added complete database schema showing transaction_type field and wallet-related values
- ✅ **Architect Review** - All implementation/documentation mismatches resolved
  - No security issues identified
  - Recommended: smoke tests for transfer/top-up flows, automated tests for balance updates
  - Future: ensure transaction descriptions consistently encode counterparty usernames

**November 9, 2025 (Demo Authentication Features - Visual Enhancements):**
- ✅ **Forgot Password Modal** - Added visual-only password reset feature to LoginPage
  - "Forgot password?" link opens modal dialog
  - Email input field with reset button
  - Toast notification confirms email sent (demo only - no backend)
  - Proper styling with shadcn/ui components
- ✅ **Social Login Buttons** - Google and Facebook login options on LoginPage and RegisterPage
  - Branded buttons with official logos (Google 4-color, Facebook blue)
  - "Or continue with" divider for clean visual separation
  - Toast notifications confirm provider selection (demo only - no OAuth integration)
  - Type="button" prevents form submission interference
- ✅ **Security Settings Section** - Comprehensive security management in ProfilePage
  - Email Verification: Status badge (verified/not verified) with resend button
  - Two-Factor Authentication: Interactive toggle switch with state management
  - Active Sessions: Table displaying current and past device sessions with terminate buttons
  - Rate Limiting: Informational banner explaining brute force protection (5 attempts, 15min lockout)
  - Session Timeout: Visual indicator showing 30-day inactivity expiration
  - All features use local state + toast notifications (no backend integration)
- ✅ **Code Quality & Architecture** - Clean implementation following best practices
  - All demo features properly scoped as visual-only (no API calls)
  - No interference with existing authentication flow
  - Responsive design with proper mobile support
  - Consistent with shadcn/ui component library styling

**November 9, 2025 (Authentication Feature Enhancement - Full Specification Compliance):**
- ✅ **React Hook Form + Zod Validation** - Implemented comprehensive form validation for authentication
  - LoginPage: Email format validation, password minimum 6 characters
  - RegisterPage: All fields validated, PIN fields with 4-digit numeric requirement
  - Real-time error display for improved user experience
- ✅ **PIN During Registration** - Users now set up their security PIN during account creation
  - PIN input field (4 digits, numeric only, password-masked)
  - Confirm PIN field with matching validation
  - Backend enforcement: registration rejected without valid PIN
- ✅ **Logout Endpoint Implementation** - Complete server-side logout flow
  - POST /api/auth/logout endpoint with JWT protection
  - AuthStore updated to call API before clearing local state
  - TopNav component updated to use async logout method
  - Proper logging of logout events for security audit trail
- ✅ **Password Strength Validation** - Enforced minimum 6 character requirement
  - Frontend: Zod schema validation with clear error messages
  - Backend: Consistent validation (existing)
- ✅ **Security Improvements** - Mandatory PIN requirement prevents bypassing critical security features
  - All savings pocket operations require PIN
  - Enhanced account security from registration onwards
- ✅ **Code Quality** - Followed best practices throughout
  - Proper error handling in async logout
  - Validation order optimization (fail fast on invalid data)
  - No security vulnerabilities introduced

**November 9, 2025 (Interactive Expected Payments Feature - Full CRUD):**
- ✅ **ExpectedPaymentModal Component** - Complete modal form for adding/editing expected payments
  - Form fields: Title, Amount, Date, Category (9 options), Frequency, Notes
  - React Hook Form with Zod validation for data integrity
  - TanStack Query mutations with automatic cache invalidation
- ✅ **Backend API Endpoints** - New `/api/expected-payments` blueprint
  - POST - Create new expected payment with recurring instance generation
  - PUT /:id - Update existing scheduled payment
  - DELETE /:id - Remove scheduled payment
  - POST /generate-recurring - Auto-generate recurring instances
- ✅ **Recurring Payment Logic** - Supports three frequency types:
  - One-time: Single instance only
  - Monthly: Generates instances for next 12 months (same date each month)
  - Weekly: Generates ~52 instances for next 12 months (same weekday) - **FIXED BUG**
  - Uses python-dateutil's relativedelta for accurate date calculations
- ✅ **DayDetailModal Integration** - Enhanced calendar day view
  - "Add Expected Payment" button in header
  - Yellow highlight and "Expected" badge for scheduled payments
  - Edit button with recurring frequency display (Monthly 📅 / Weekly 📆)
  - Opens ExpectedPaymentModal with pre-populated data for editing
- ✅ **TransactionsPage Quick Access** - Dedicated "Add Expected Payment" button next to "Finance Timeline" title
- ✅ **Data Model** - Reuses Transaction model with:
  - status='scheduled' for expected payments
  - metadata fields: category, frequency, notes, months_ahead, user_created=true
- ✅ **API Client** - Added expectedPaymentsAPI methods to src/lib/api.ts
- ✅ **Weekly Recurring Bug Fix** - Corrected logic to generate full 12-month horizon
  - Previous: Only 12 weekly instances
  - Current: ~52 weekly instances (proper coverage)
  - Uses while loop with end_date calculation instead of fixed loop count

**November 9, 2025 (Activity Section Fixes & Calendar Yellow Highlights):**
- ✅ **Removed Non-Functional Buttons** - Deleted Filter and Export buttons from Activity header
- ✅ **Centered Title Layout** - Improved title and subtitle formatting with centered alignment
- ✅ **Fixed Metadata Field Mapping** - CalendarGrid now correctly checks `t.metadata` instead of `t.transaction_metadata`
- ✅ **Added Demo Account Upcoming Payments** - User 14 (student@test.com) now has 3 scheduled payments visible on calendar
- ✅ **Yellow Calendar Highlights Working** - November 15 (Netflix), November 20 (Gym), November 25 (Rent) display correctly
- ✅ **Total Scheduled Payments** - 17 upcoming payments across 9 users (including main demo account)
- ✅ **API Verification** - Confirmed backend correctly returns scheduled transactions for each user
- ✅ **Database Consistency** - All scheduled transactions properly stored with status='scheduled' and metadata.upcoming=true

**November 9, 2025 (Activity Section & Calendar UX Improvements - Initial):**
- ✅ **Transaction List Collapsed by Default** - Cleaner interface with expandable transaction history
- ✅ **Improved Layout Flow** - Calendar now appears before transaction list for better contextual connection
- ✅ **Compact Modern Legend** - Replaced large legend with small circular icons with tooltips
- ✅ **Upcoming Payments Data** - Generated 14 realistic scheduled payments across 8 users
- ✅ **CompactColorLegend Component** - Modern horizontal legend with hover tooltips
- ✅ **Scheduled Transaction Status** - New 'scheduled' status for upcoming payments
- ✅ **Calendar Priority Logic** - Upcoming payments prioritized with yellow color
- ✅ **Payment Categories** - Rent ($350-$425), Subscriptions ($10.99-$54.99), Utilities ($35-$60)