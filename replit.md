# UniPay - Smart Student Digital Wallet

## Overview

UniPay is a digital wallet application for students, integrating financial services with lifestyle features. It provides secure digital payments, subscription management, student discounts, savings goal tracking, and peer-to-peer lending and marketplace functionalities. The project's ambition is to become an indispensable financial tool for students, offering convenience, security, and tailored benefits.

## User Preferences

No specific user preferences recorded yet. This section will be updated as development progresses.

## System Architecture

UniPay is a single-page application (SPA) with a distinct backend and frontend.

**UI/UX Decisions:**
The frontend features a Revolut-inspired modern interface using `shadcn/ui` (Radix UI, Tailwind CSS). Key design elements include:
*   A fixed top navigation bar and responsive navigation (desktop sidebar, mobile bottom nav).
*   A modern color palette with violet/indigo gradients and pastel accents.
*   Card-based layouts with shadows and rounded corners.
*   Framer Motion for smooth animations.
*   An eye-catching gradient balance card with quick action buttons.
*   Distinct `DashboardLayout` for authenticated users and `AuthLayout` for unauthenticated users.

**Technical Implementations:**
*   **Backend:** Flask (Python) with SQLAlchemy for ORM (PostgreSQL), Flask-JWT-Extended for authentication, and Flask-SocketIO for real-time features. It uses an Application Factory Pattern and Flask Blueprints for modularity. Security includes JWT, password hashing, PIN protection, and CORS.
*   **Frontend:** React 18 with Vite. State management uses Zustand (client-side, auth) and TanStack Query (server-side data). Axios handles HTTP requests with JWT interceptors. React Router DOM manages public and protected routes.
*   **Feature Specifications:**
    *   **Authentication:** User registration, login, JWT, PIN setup.
    *   **Wallet:** Balance, top-up, P2P transfers.
    *   **Transactions:** Tracking, filtering, statistics.
    *   **Virtual Cards:** Creation, management (freeze/unfreeze), subscription linking.
    *   **Subscriptions:** Management of recurring payments.
    *   **Savings:** Secure pockets with auto-save, PIN-protected withdrawals, and goal tracking.
    *   **Marketplace:** Student-to-student commerce with listings and escrow.
    *   **P2P Lending:** Loan requests, debt tracking, repayment.
    *   **ISIC Discounts:** Integration for student card-based discounts.

**System Design Choices:**
*   **Database Schema:** Core entities include Users, Wallets, Transactions, VirtualCards, Subscriptions, SavingsPockets, Goals, Marketplace Listings & Orders, Loans & Repayments, and ISIC-related models.
*   **API Design:** RESTful API endpoints are organized by feature (e.g., `/api/auth`, `/api/wallet`).
*   **Development Workflow:** Concurrent backend (Python) and frontend (Node.js) development with proxying for API requests. Database migrations are managed via Flask-Migrate (Alembic).

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
*   **Animations:** Framer Motion## Recent Changes

**November 8, 2025 (Collapsible Filterable Transaction List):**
- ✅ **CollapsibleTransactionList Component** - New accordion-style component with smooth expand/collapse animations
- ✅ **Transaction Filtering** - Three filter tabs: All, Income (green), Expenses (red) with transaction counts
- ✅ **Smart Categorization** - Correctly classifies transfers as income/expense based on user_id comparison
- ✅ **Summary Display** - Shows transaction count and total amount when collapsed
- ✅ **Visual Enhancements** - Color-coded filter buttons, progress indicators, custom scrollbar for long lists
- ✅ **Performance Optimized** - Helper functions for classification, smooth Framer Motion animations
- ✅ **Responsive Design** - Works on mobile and desktop with touch-optimized interactions
- ✅ **Activity Page Integration** - Replaces static list with collapsible component in TransactionsPage

**November 8, 2025 (Fully Enriched Historical Data - 260 Total Transactions with Mixed Days):**
- ✅ **Transaction History Generator** - Python script with auto-confirm for seamless batch generation
- ✅ **260 Historical Transactions** - Successfully inserted over 6 months: May 13 - Nov 6, 2025 (3 batches: 85 + 81 + 94)
- ✅ **Extremely Rich Distribution** - ~10.4 transactions/week (84 income, 88 payments, 88 transfers)
- ✅ **All Accounts Fully Enriched** - Every account (16/16) has 15-40 transactions with varied patterns
- ✅ **35 Mixed-Activity Days** - Days where users both receive AND spend money (gradient calendar cells 🟣)
- ✅ **Realistic Daily Patterns** - 25% mixed days, 22% income-only days, 53% expense-only days
- ✅ **Natural Amounts** - $5-$1,000 range (30% small, 40% medium, 20% large, 10% very large)
- ✅ **Balance Preservation** - Wallet balances unchanged (historical data only, no negative balances)
- ✅ **Peak Activity** - June (52 txns, 9 mixed days), August (48 txns) show authentic student patterns
- ✅ **141 Active Days** - Rich calendar with colorful visual indicators across 6 months
- ✅ **Audit Trail** - All transactions tagged with `HISTORICAL_GEN_2025` for easy identification
- ✅ **Reversibility** - Cleanup script available to remove all 260 generated transactions
- ✅ **Comprehensive Reports** - 3 CSV exports, JSON summaries, and detailed analytics in `backend/transaction_reports/`
- ✅ **Calendar Integration** - Finance Timeline displays gradient cells for mixed days, green for income, red for expenses

**November 8, 2025 (Critical Mock-to-API Migration & Performance Optimization):**
- ✅ **Piggy Goals API Integration** - Connected PiggyGoalsPage to real backend endpoints (replaced mock data with savingsAPI)
- ✅ **P2P Loans API Integration** - Connected EnhancedLoansPage to real backend endpoints (replaced mock data with loansAPI)
- ✅ **Backend N+1 Query Fix** - Added SQLAlchemy `joinedload` for lender/borrower relationships to prevent N+1 queries
- ✅ **Loan Model Enhancement** - Added username objects to loan responses for better frontend data display
- ✅ **Repaid Loans Classification** - Fixed history tab to properly distinguish between lent vs borrowed repaid loans
- ✅ **Field Name Standardization** - Standardized `deadline` field (mapped from backend's `due_date`) across all loan responses
- ✅ **Code Cleanup** - Removed unused budgetAPI code from frontend api.ts

**November 8, 2025 (Critical API & UI Fixes):**
- ✅ **Wallet API trailing slash fix** - Backend now accepts both `/api/wallet` and `/api/wallet/` to prevent 308 redirects
- ✅ **Transactions API trailing slash fix** - Backend now accepts both `/api/transactions` and `/api/transactions/` to prevent 308 redirects
- ✅ **Finance Timeline API integration** - Fixed transaction data loading, calendar now displays real transaction data
- ✅ **Finance Timeline redesign** - Changed from small dots to **full pastel cell backgrounds** for better visibility:
  - 🟢 Light green (`bg-green-50`) for income days (topups, income, refunds)
  - 🔴 Light red (`bg-red-50`) for expense days (transfers, payments, purchases)
  - 🟡 Light yellow (`bg-yellow-50`) for upcoming payments (pending transactions)
  - 🔴🟢 Red-to-green gradient for days with both income and expenses
- ✅ **Dashboard button routing** - Fixed quick action buttons to route correctly:
  - Top Up → `/topup`
  - Transfer → `/transfers`
  - Cards → `/budget-cards`
- ✅ **Transaction type field fix** - Updated calendar components to use `transaction_type` instead of `type`

**November 8, 2025 (Finance Timeline - Transaction Calendar):**
- ✅ **Comprehensive documentation** - docs/features/17-finance-timeline.md with complete specifications
- ✅ **Calendar view component** - Monthly calendar grid with smooth month navigation  
- ✅ **Day detail modal** - Click any day to see detailed transaction list with totals
- ✅ **Transaction grouping** - Smart grouping by date with income/expense calculation
- ✅ **Today highlight** - Current date highlighted with violet border
- ✅ **Responsive design** - Mobile-friendly calendar with touch-optimized interactions
- ✅ **Smooth animations** - Framer Motion transitions for calendar and modal
- ✅ **Navigation integration** - Accessible via sidebar with CalendarDays icon

**November 8, 2025 (Piggy Goals - Financial Goals Feature):**
- ✅ **Comprehensive documentation** - docs/features/18-piggy-goals.md with 400+ lines
- ✅ **PiggyGoalsPage component** - Main page with goals grid and empty state
- ✅ **GoalCard component** - Individual goal cards with progress bars and action buttons
- ✅ **CreateGoalModal** - Form with icon picker, target amount, deadline, and validation
- ✅ **TransferToGoalModal** - Manual fund transfer with wallet balance check and preset amounts
- ✅ **GoalProgressBar** - Color-coded progress bar (red→yellow→blue→green based on %)
- ✅ **ConfettiCelebration** - Canvas-based confetti animation with particle physics
- ✅ **GoalCompletionModal** - Celebration modal with trophy icon and achievement summary
- ✅ **Multiple active goals** - Grid display with 1-3 columns (responsive)
- ✅ **Gamification effects** - Confetti animation when goal reaches 100%
- ✅ **Progress tracking** - Percentage display, remaining amount, days until deadline
- ✅ **Navigation integration** - Accessible via sidebar with Target icon
- 📋 **Pending** - API endpoints for CRUD operations, goal achievements system

**November 8, 2025 (P2P Borrow/Lend System):**
- ✅ **Comprehensive documentation** - docs/features/19-p2p-lending.md with 450+ lines
- ✅ **EnhancedLoansPage** - Main page with 3 tabs (Owed to Me, I Owe, History)
- ✅ **Summary cards** - Total owed, total owing, net balance, overdue count
- ✅ **DebtCard component** - Loan details with profile, progress bar, deadline badges
- ✅ **LoanRequestModal** - Multi-tab request system (Username, QR Code, Contacts)
- ✅ **QRCodeDisplay** - QR generation with loan data, share/save functionality
- ✅ **LoanHistoryList** - Repaid loans with duration and on-time badges
- ✅ **Reminder system** - Send reminder button with toast notifications
- ✅ **Repayment actions** - Repay button on debt cards
- ✅ **Overdue detection** - Red badges for overdue loans
- ✅ **Validation** - Zod schema with $5-$500 limits, 10-200 char descriptions
- ✅ **Color-coded QR** - Amount-based colors (green/blue/orange/red)
- 📋 **Pending** - API integration, QR scanning, automated reminders
