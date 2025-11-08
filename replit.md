# UniPay - Smart Student Digital Wallet

### Overview
UniPay is a digital wallet application designed for students, integrating financial services with lifestyle features. Its core purpose is to provide secure digital payments, comprehensive subscription management, exclusive student discounts, robust savings goal tracking, and peer-to-peer lending and marketplace functionalities. The project aims to become an essential financial tool for students, offering convenience, security, and tailored benefits to enhance their financial well-being and daily lives.

### User Preferences
No specific user preferences recorded yet. This section will be updated as development progresses.

### System Architecture
UniPay is structured as a Single-Page Application (SPA) with a clear separation between its backend and frontend components.

**UI/UX Decisions:**
The frontend draws inspiration from modern financial applications like Revolut, utilizing `shadcn/ui` (built on Radix UI and Tailwind CSS) for a contemporary look and feel. Key design elements include a responsive navigation system (fixed top bar, desktop sidebar, mobile bottom nav), a modern color palette featuring violet/indigo gradients and pastel accents, card-based layouts with subtle shadows and rounded corners, and Framer Motion for fluid animations. Distinct `DashboardLayout` and `AuthLayout` are used for authenticated and unauthenticated user experiences, respectively.

**Technical Implementations:**
*   **Backend:** Developed with Flask (Python), it uses SQLAlchemy for ORM with a PostgreSQL database. Authentication is handled by Flask-JWT-Extended, and real-time features are powered by Flask-SocketIO. The architecture employs an Application Factory Pattern and Flask Blueprints for modularity, ensuring a scalable and maintainable codebase. Security measures include JWT, robust password hashing, PIN protection, and CORS.
*   **Frontend:** Built with React 18 and Vite for fast development, state management is handled by Zustand (for client-side and authentication states) and TanStack Query (for server-side data synchronization). Axios is used for HTTP requests, incorporating JWT interceptors. React Router DOM manages navigation between public and protected routes.
*   **Feature Specifications:**
    *   **Authentication:** User registration, login, JWT management, and PIN setup.
    *   **Wallet:** Balance display, top-up functionalities, and peer-to-peer transfers.
    *   **Transactions:** Comprehensive tracking, filtering, and statistical analysis of transactions.
    *   **Budget Cards (Unified):** Creation and management of virtual cards for payments, budget tracking, and subscriptions. This includes features like freezing/unfreezing cards, allocating funds, spending tracking, and linking subscriptions.
    *   **Savings:** Secure savings pockets with auto-save options, PIN-protected withdrawals, and goal tracking.
    *   **Marketplace:** A student-to-student commerce platform supporting listings and escrow services.
    *   **P2P Lending:** Functionality for requesting loans, tracking debt, and managing repayments.
    *   **ISIC Discounts:** Integration to provide student card-based discounts.
    *   **Finance Timeline:** A calendar view for visualizing and managing financial activities and upcoming payments.
    *   **Piggy Goals:** A gamified feature for setting and achieving financial savings goals with progress tracking and celebratory animations.
    *   **P2P Borrow/Lend System:** An enhanced system for managing loans with features like request modals, QR code sharing, and repayment tracking.

**System Design Choices:**
*   **Database Schema:** The core database schema supports entities such as Users, Wallets, Transactions, VirtualCards, Subscriptions, SavingsPockets, Goals, Marketplace Listings & Orders, Loans & Repayments, and ISIC-related models.
*   **API Design:** A RESTful API organizes endpoints logically by feature (e.g., `/api/auth`, `/api/wallet`, `/api/cards`).
*   **Development Workflow:** Concurrent development of the Python backend and Node.js frontend is supported, with proxying for API requests. Database migrations are managed efficiently using Flask-Migrate (Alembic).

### External Dependencies

*   **Database:** PostgreSQL (utilizing Replit's built-in service)
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

### Recent Changes

**November 8, 2025 (Banking Details for All Card Types):**
- ✅ **Universal Banking Support** - All card types (payment, budget, subscription) now have IBAN and SWIFT codes
- ✅ **VirtualCard Model Update** - get_iban() and get_swift() methods now generate banking details for all card purposes
- ✅ **Deterministic IBAN Generation** - IBAN format: GB82 UNIP 0000 0000 [last 8 digits], generated deterministically based on card ID
- ✅ **SWIFT Code** - All cards use standard SWIFT/BIC code: UNIPGB2L
- ✅ **to_dict Enhancement** - Banking details (IBAN, SWIFT) included for all card types when include_sensitive=True
- ✅ **BudgetCardDetailDialog** - New component displaying budget card details with banking information section
- ✅ **Budget Card Banking UI** - Shows budget overview, allocated/spent stats, and complete banking details (IBAN, SWIFT, dates)
- ✅ **Subscription Card Banking Tab** - Added 4th "Banking" tab to SubscriptionCardDetailDialog (alongside Active/Available/Custom)
- ✅ **Unified Security Pattern** - All detail dialogs use show/hide toggle for sensitive banking information
- ✅ **Copy to Clipboard** - One-click copy functionality for IBAN and SWIFT codes across all card types
- ✅ **Budget Card Actions** - Updated button layout: Details + Add Funds + Spend (3-column grid)
- ✅ **Security Notices** - Amber warning cards in all detail dialogs with banking security best practices
- ✅ **Date Display** - Creation dates and last reset dates shown in human-readable format
- 📋 **Architecture** - Three specialized detail dialogs (PaymentCardDetailDialog, BudgetCardDetailDialog, SubscriptionCardDetailDialog) each with banking details section; IBAN/SWIFT exposed only with include_sensitive flag for security