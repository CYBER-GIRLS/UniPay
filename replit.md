# UniPay - Smart Student Digital Wallet

## Overview

UniPay is a digital wallet application tailored for students, integrating financial services with lifestyle features. It aims to provide a comprehensive solution for managing finances, subscriptions, savings, and peer-to-peer interactions within a student community. Key capabilities include secure digital payments, subscription management, student discounts, savings goal tracking, and peer-to-peer lending and marketplace functionalities. The project's ambition is to become an indispensable financial tool for students, offering convenience, security, and tailored benefits.

## User Preferences

No specific user preferences recorded yet. This section will be updated as development progresses.

## System Architecture

UniPay is built as a single-page application (SPA) with a clear separation between its backend and frontend.

**UI/UX Decisions:**
The frontend has been redesigned with a **Revolut-inspired modern interface**, utilizing `shadcn/ui` built on Radix UI and Tailwind CSS. The design features:
*   **Top Navigation Bar:** Fixed header with UniPay logo, settings icon, and profile dropdown menu (My Profile, Settings, Logout)
*   **Responsive Navigation:** Desktop sidebar and mobile bottom navigation bar with icons for all main sections
*   **Modern Color Palette:** Soft violet and indigo gradients (inspired by Revolut) with pastel accent colors
*   **Card-Based Layout:** Clean, minimalistic cards with shadows and rounded corners throughout
*   **Smooth Animations:** Framer Motion animations for page transitions, hover effects, and interactive elements
*   **Gradient Balance Card:** Eye-catching wallet balance display with quick action buttons (Top Up, Transfer, Cards)
The application features distinct layouts for authenticated (`DashboardLayout`) and unauthenticated (`AuthLayout`) users, providing a structured user experience.

**Technical Implementations:**
*   **Backend:** Developed with Flask (Python), using SQLAlchemy for ORM with PostgreSQL. Authentication is handled via Flask-JWT-Extended, with Flask-SocketIO for potential real-time features. The architecture follows an Application Factory Pattern for flexible configuration and uses Flask Blueprints for modular feature organization (e.g., auth, wallet, transactions). Security measures include JWT-based authentication, password hashing, PIN protection for sensitive operations, and CORS.
*   **Frontend:** Built with React 18 and Vite. State management is split between Zustand for client-side and authentication state, and TanStack Query for server-side data fetching and caching. Axios is used for HTTP requests, with interceptors for automatic JWT attachment. Routing is managed by React Router DOM, distinguishing between public and protected routes.
*   **Feature Specifications:**
    *   **Authentication:** User registration, login, JWT token management, PIN setup and verification.
    *   **Wallet:** Balance inquiry, top-up, and peer-to-peer transfers.
    *   **Transactions:** Comprehensive tracking of all financial operations with filtering and statistics.
    *   **Virtual Cards:** Creation, management (freeze/unfreeze), and linking to subscriptions.
    *   **Subscriptions:** Management of recurring payments linked to virtual cards.
    *   **Savings:** Creation of secure savings pockets with auto-save and PIN-protected withdrawals, alongside savings goals with progress tracking and gamification.
    *   **Marketplace:** Student-to-student commerce with listing creation, browsing, and an escrow payment system.
    *   **P2P Lending:** Loan requests, debt tracking, and repayment management.

**System Design Choices:**
*   **Database Schema:** Core entities include Users, Wallets, Transactions, VirtualCards, Subscriptions, SavingsPockets, Goals, Marketplace Listings & Orders, and Loans & Repayments, all structured to support the outlined features and their interrelationships.
*   **API Design:** RESTful API endpoints are organized by feature (e.g., `/api/auth`, `/api/wallet`) with clear conventions for resource interaction.
*   **Development Workflow:** The project is configured for concurrent backend (Python) and frontend (Node.js) development, with a proxy setup to direct API requests from the frontend to the backend. Database migrations are managed via Flask-Migrate (Alembic).

## External Dependencies

*   **Database:** PostgreSQL (managed by Replit's built-in service)
*   **Backend Framework:** Flask (Python)
*   **Frontend Framework:** React 18
*   **Authentication:** Flask-JWT-Extended (for JWT tokens)
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

**November 8, 2025 (ISIC Student Discounts Feature):**
- ✅ **Complete ISIC integration** - Link student card for automatic discounts
- ✅ **Backend models** - ISICProfile, Merchant, DiscountApplication with full CRUD
- ✅ **15+ partner merchants** - KFC, McDonald's, Starbucks, Nike, Spotify, and more
- ✅ **Digital ISIC card** - Full-screen card display with QR code verification
- ✅ **Merchant database** - Browse partners by category (Food, Retail, Sports, etc.)
- ✅ **Online detection** - URL/domain matching for automatic discount detection
- ✅ **Physical detection** - NFC simulation for in-store payments
- ✅ **Discount notifications** - Banner and full-screen alerts for detected discounts
- ✅ **Discount history** - Track savings and applied discounts
- ✅ **13 API endpoints** - Profile management, merchant detection, discount application
- ✅ **Visual components** - ISICCardPage, MerchantsList, DiscountHistory, DiscountAlert
- ✅ **Navigation integration** - ISIC Discounts accessible via sidebar with Percent icon
- 📋 **Pending** - Real NFC integration, actual ISIC API verification

**November 8, 2025 (Critical Bug Fix - Infinite Redirect Loop):**
- 🐛 **Fixed infinite redirect loop** - Application was flickering with constant white screens
- ✅ **Root cause identified** - Dashboard queries running before auth check, causing 401 errors
- ✅ **Axios interceptor fix** - Added `isRedirecting` flag to prevent duplicate redirects
- ✅ **Auth state cleanup** - Properly clear all localStorage items including Zustand auth-storage
- ✅ **React Query configuration** - Disable retry on 401 errors, limit max retries to 1
- ✅ **Query gating** - Dashboard queries now use `enabled: isAuthenticated` flag
- ✅ **Stable application** - No more flickering, clean login/logout flow

**November 7, 2025 (Subscription Cards Feature):**
- ✅ **Complete Subscription Cards management system** - Full backend and frontend
- ✅ **SubscriptionCard model** - Status tracking (active/paused), billing dates, cost tracking
- ✅ **7 API routes** - Catalog, CRUD, statistics, payment processing
- ✅ **Predefined catalog** - 15+ popular services (Spotify, Netflix, YouTube Premium, etc.)
- ✅ **5 frontend components** - CatalogView, CustomSubscriptionForm, SubscriptionsList, SummaryWidget, NotificationPlaceholder
- ✅ **Subscription Dashboard** - Tab-based navigation (Catalog / My Subscriptions)
- ✅ **Date formatting fix** - Frontend/backend date parsing compatibility
- ✅ **Component documentation** - Each file has purpose, functions, and status markers
- ✅ **Comprehensive feature docs** - docs/features/13-subscriptions.md with full API reference

## Recent Changes

**November 7, 2025 (UI Redesign):**
- ✅ **Complete Revolut-inspired UI redesign** - Modern, clean, and interactive interface
- ✅ **Top Navigation Bar** - Fixed header with profile dropdown and settings
- ✅ **Responsive Sidebar/Bottom Nav** - Desktop sidebar transforms to bottom navigation on mobile
- ✅ **New Color Palette** - Violet and indigo gradients with soft pastels
- ✅ **Redesigned Dashboard** - Card-based layout with gradient balance card
- ✅ **Profile Page** - User info display with achievements and progress widgets
- ✅ **Settings Page** - Organized settings sections with icons
- ✅ **Smooth Animations** - Framer Motion for page transitions and hover effects
- ✅ **Fully Responsive** - Optimized for both desktop and mobile devices

**November 7, 2025 (Database & Authentication):**
- ✅ PostgreSQL database fully operational - All 9 tables initialized and tested
- ✅ Complete authentication system - Registration, login, JWT tokens, /me endpoint
- ✅ Wallet operations functional - Get balance, top-up, P2P transfers
- ✅ Transaction tracking working - Dual-record system for transfers, accurate stats
- ✅ Critical bug fixes - JWT identity type conversion, transaction stats, SQLAlchemy relationships
- ✅ Frontend connected - All API endpoints working correctly

**November 7, 2025 (Feature Expansion - Interactive Pages):**
- ✅ **Virtual Cards Page** - Create cards, freeze/unfreeze with per-item loading states
- ✅ **Savings Page** - DarkDays Pocket management, Piggy Goals with progress tracking
- ✅ **Marketplace Page** - Create listings, browse items, buy with escrow payments
- ✅ **P2P Loans Page** - Create loans, track debts, make repayments
- ✅ **Transactions Page** - View transaction history with stats
- ✅ **Set-based per-item loading states** - Prevents race conditions during concurrent operations
- ✅ **Comprehensive error handling** - Toast notifications for all mutations
- ✅ **Input validation** - Numeric inputs enforce positive values with min/step attributes
- ✅ **Production-ready UX** - Independent loading states, proper feedback, validation

**November 7, 2025 (New Feature Pages & Comprehensive Documentation):**
- ✅ **Transfers Page** - Dedicated P2P transfer interface with send/receive history
- ✅ **Top-up Page** - Dedicated wallet funding with multiple payment methods (card, bank, QR)
- ✅ **Notifications Page** - Alert system UI with categorized notifications (WebSocket integration planned)
- ✅ **Navigation Updates** - All 12 features accessible via sidebar and mobile bottom nav
- ✅ **Complete Documentation System** - 12 feature docs, architecture overview, API reference
- ✅ **Documentation Structure** - docs/features/, docs/architecture/, docs/api/ with clear completion status

## Feature Status Summary

**Completed Features (Full CRUD):**
1. ✅ Authentication - Login, register, JWT tokens
2. ✅ Wallet - Balance, top-up, P2P transfers
3. ✅ Virtual Cards - Create, freeze/unfreeze, manage
4. ✅ Transactions - History, statistics, filtering
5. ✅ Savings - DarkDays Pocket, Piggy Goals
6. ✅ Marketplace - Student trading with escrow
7. ✅ P2P Loans - Lending, debt tracking, repayments
8. ✅ Transfers - Dedicated transfer interface
9. ✅ Top-up - Wallet funding methods
10. ✅ Profile - User information display
11. ✅ Settings - Account management UI
12. 🚧 Notifications - UI complete (WebSocket integration planned)
13. ✅ Subscriptions - Recurring payment management with catalog
14. ✅ ISIC Discounts - Student discount detection and application

## Documentation

Comprehensive documentation available in `/docs`:
- **Features** (14 docs): Detailed component descriptions, functionality, implementation
- **Architecture**: System overview, technology stack, design patterns
- **API**: Complete endpoint reference with request/response examples

## Latest Features Documentation

**DarkDays Pocket / Secure Wallet** (`docs/features/14-darkdays-pocket.md`):
- Comprehensive documentation of all 8 expected functionalities
- Clear marking of implemented vs pending features
- Component specifications and implementation roadmap
- Security considerations and UX guidelines

## Component Status

**DarkDays Pocket Components:**
1. ✅ DarkDaysCard - Black card visualization with vault aesthetics
2. ✅ SecurityVerificationModal - Multi-step PIN + password verification
3. ✅ AutoSaveConfigPanel - Auto-save configuration with percentage slider
4. ✅ EmergencyUnlockDialog - Emergency access with category selection
5. ✅ SavingsReportWidget - Progress reports and milestone tracking
6. ✅ DarkDaysPocketPage - Main interface integrating all components

## Notes

- The project uses the built-in Replit PostgreSQL database
- Both backend (port 8000) and frontend (port 5000) run concurrently
- Frontend proxies `/api` requests to backend
- JWT tokens are stored in localStorage and automatically attached to requests
- All sensitive operations require PIN verification
- Database migrations should be used for schema changes in production
- UI designed with Revolut-style modern fintech aesthetics
- Fully responsive design adapts to mobile and desktop viewports
- Documentation clearly marks completed vs planned features
