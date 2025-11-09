# UniPay - Smart Student Digital Wallet

## Overview
UniPay is a digital wallet application specifically designed for students, integrating financial services with lifestyle features. Its core purpose is to provide secure digital payments, subscription management, student discounts, savings goal tracking, and peer-to-peer lending and marketplace functionalities. UniPay aims to be an essential financial tool for students, offering convenience, security, customized benefits, and fostering financial literacy and independence.

## User Preferences
No specific user preferences recorded yet. This section will be updated as development progresses.

## System Architecture

UniPay is structured as a single-page application (SPA) with a clear separation between its backend and frontend components.

### UI/UX Decisions
The frontend features a modern, Revolut-inspired interface, built with `shadcn/ui` (Radix UI, Tailwind CSS). Key design elements include a fixed top navigation, responsive navigation (desktop sidebar, mobile bottom nav), a modern color palette with violet/indigo gradients and pastel accents, card-based layouts with shadows and rounded corners, Framer Motion for animations, and a gradient balance card with quick action buttons. `DashboardLayout` is used for authenticated users and `AuthLayout` for unauthenticated users.

**Dialog/Popup Scrolling Pattern:** All dialogs and popups use a standardized scrollable pattern to ensure proper viewport fitting:
- `DialogContent`: `flex flex-col max-h-[90vh]` - Sets max height at 90% viewport and flex layout
- `DialogHeader`: `flex-shrink-0` - Fixed header that doesn't scroll
- Content wrapper: `overflow-y-auto flex-1 pr-2` - Scrollable content area with right padding for scrollbar
- Applied to: EmergencyUnlockDialog, BudgetCardDetailDialog, PaymentCardDetailDialog, SubscriptionCardDetailDialog

### Technical Implementations

*   **Backend:** Developed using Flask (Python), employing SQLAlchemy for ORM (PostgreSQL), Flask-JWT-Extended for authentication, and Flask-SocketIO for real-time features. It utilizes an Application Factory Pattern and Flask Blueprints for modularity, incorporating security measures like JWT, password hashing, PIN protection, and CORS.
*   **Frontend:** Built with React 18 and Vite. State management is handled by Zustand (client-side, authentication) and TanStack Query (server-side data). Axios manages HTTP requests with JWT interceptors, and React Router DOM handles navigation.
*   **Feature Specifications:**
    *   **Authentication:** User registration, login, JWT token management, PIN setup, and visual-only forgot password and social login features. Includes default PIN system with secure change functionality and security warnings for default PIN usage.
    *   **Wallet:** Balance display, top-up functionality, peer-to-peer transfers, and visual multi-currency support with transfer scheduling.
    *   **Transactions:** Comprehensive tracking, filtering, and statistical analysis with 15+ transaction types. Supports "expected payments" (CRUD and recurring instances) and includes balance validation, race condition protection, and detailed transaction records with metadata.
    *   **Virtual Cards:** Creation, management (freeze/unfreeze), and linking to subscriptions. Card payments include freeze/limit checks.
    *   **Subscriptions:** Management of recurring payments.
    *   **Savings (DarkDays Pocket):** Secure, PIN-protected savings pockets with auto-save options and goal tracking. Features a consolidated settings interface combining savings goal configuration and auto-save settings with a single Save button. Includes editable target amount for goals, dynamic progress tracking, and emergency withdrawal flow with metadata tracking and security verification.
    *   **Marketplace:** Student-to-student commerce platform supporting listings and escrow services with buyer balance validation and dual transaction recording.
    *   **P2P Lending:** Functionality for loan requests, debt tracking, and repayment, including lender/borrower balance validation and dual transaction recording.
    *   **ISIC Discounts:** Integration to provide student card-based discounts.
    *   **Security Settings:** PIN management with default PIN detection and change functionality (password-verified), visual-only features for email verification, two-factor authentication, active sessions management, rate limiting, and session timeout.
    *   **Notifications:** Comprehensive toast notification system for all features, including error handling for budget card spending. UI dialogs are optimized for various screen sizes with proper scrolling.

### System Design Choices

*   **Database Schema:** Core entities include Users, Wallets, Transactions (with `status='scheduled'` for expected payments), VirtualCards, Subscriptions, SavingsPockets, Goals, Marketplace Listings & Orders, Loans & Repayments, and ISIC-related models.
*   **API Design:** A RESTful API with logically organized endpoints (e.g., `/api/auth`, `/api/wallet`, `/api/expected-payments`). Proper HTTP status codes are used for error handling.
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