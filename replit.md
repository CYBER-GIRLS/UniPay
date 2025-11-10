# UniPay - Smart Student Digital Wallet

## Overview
UniPay is a digital wallet application designed for students, integrating financial services with lifestyle features. Its core purpose is to provide secure digital payments, subscription management, student discounts, savings goal tracking, and peer-to-peer lending and marketplace functionalities. UniPay aims to be an essential financial tool, offering convenience, security, customized benefits, and fostering financial literacy and independence.

## User Preferences
No specific user preferences recorded yet. This section will be updated as development progresses.

## System Architecture

UniPay is structured as a single-page application (SPA) with a clear separation between its backend and frontend components.

### UI/UX Decisions
The frontend features a modern, Revolut-inspired interface, built with `shadcn/ui` (Radix UI, Tailwind CSS). Key design elements include a fixed top navigation, a fully responsive collapsible left sidebar, a modern color palette with violet/indigo gradients and pastel accents, card-based layouts, Framer Motion for animations, and a gradient balance card with quick action buttons. `DashboardLayout` is used for authenticated users and `AuthLayout` for unauthenticated users.

**Key UI/UX Features:**
*   **Responsive Collapsible Sidebar:** Universally available on the left, edge-to-edge layout, responsive widths using `clamp()`, touch-friendly controls, smooth Framer Motion animations, persistent state via Zustand, and full accessibility.
*   **Dialog/Popup Scrolling Pattern:** Standardized scrollable pattern for all dialogs to ensure proper viewport fitting (`max-h-[90vh]`, `overflow-y-auto`).
*   **Dashboard Balance Card:** Premium digital bank card design with authentic 7:4 aspect ratio (matching real bank cards), fully percent-based positioning system for consistent scaling across all screen sizes, text elements (balance label, amount, currency) perfectly centered vertically and horizontally, action buttons (Top Up, Transfer, Cards) anchored to bottom with proportional spacing, enhanced depth with layered shadows (light and ambient), diagonal gradient background with glassmorphic overlays, subtle decorative elements (blur orbs, SVG patterns), animated shimmer effect respecting reduced motion preferences, EMV chip and wallet branding icons with percent-based sizing, and all internal elements scaling proportionally based on card dimensions.
*   **Comprehensive Fluid Design System:** Fully responsive design using `CSS clamp()` for seamless scaling of typography (e.g., `text-h1` to `text-h6` and `text-display`), spacing, and components across all viewport sizes (320px-1440px), eliminating breakpoint-specific overrides and ensuring consistent visual language. All animations respect `prefers-reduced-motion`.

### Technical Implementations
*   **Backend:** Flask (Python), SQLAlchemy (PostgreSQL), Flask-JWT-Extended for authentication, Flask-SocketIO for real-time features. Utilizes an Application Factory Pattern and Flask Blueprints for modularity, with security measures like JWT, password hashing, PIN protection, and CORS.
*   **Frontend:** React 18 and Vite. State management via Zustand (client-side) and TanStack Query (server-side). Axios for HTTP requests with JWT interceptors, and React Router DOM for navigation.

**Core Feature Specifications:**
*   **Authentication:** User registration, login, JWT token management, PIN setup/change, and visual-only features for forgot password and social login.
*   **Wallet:** Balance display, top-up, peer-to-peer transfers, and multi-currency support with transfer scheduling.
*   **Transactions:** Comprehensive tracking, filtering, and statistical analysis for 15+ types, including "expected payments" (CRUD, recurring), balance validation, race condition protection, and detailed records.
*   **Virtual Cards:** Creation, management (freeze/unfreeze), linking to subscriptions, and payment checks.
*   **Subscriptions:** Management of recurring payments.
*   **Savings & Goals:** Dedicated goal tracking with progress indicators, contributions, editable targets, and completion celebrations.
*   **DarkDays Pocket:** Secure, PIN-protected savings pockets with auto-save options, consolidated settings, and emergency withdrawal flow with security verification.
*   **Marketplace:** Student-to-student commerce with listings and escrow services, buyer balance validation, and dual transaction recording.
*   **P2P Lending:** Request-approval system with distinct tabs ("Pending Requests," "My Requests," "I Owe," "Owed to Me"), approval workflow, summary statistics, full loan lifecycle tracking, role-based actions, visual indicators, and robust security including balance validation and race condition protection.
*   **ISIC Discounts:** Integration for student card-based discounts.
*   **Security Settings:** PIN management (with default PIN detection and password-verified change), visual-only features for email verification, 2FA, active sessions, rate limiting, and session timeout.
*   **Notifications:** Comprehensive toast notification system and optimized UI dialogs for various screen sizes.

### System Design Choices
*   **Database Schema:** Core entities include Users, Wallets, Transactions, VirtualCards, Subscriptions, SavingsPockets, Goals, Marketplace (Listings, Orders), Loans, Repayments, and ISIC models.
*   **API Design:** RESTful API with logically organized endpoints and proper HTTP status codes.
*   **Development Workflow:** Supports concurrent backend (Python) and frontend (Node.js) development with API proxying. Flask-Migrate (Alembic) for database migrations.

## External Dependencies

*   **Database:** PostgreSQL
*   **Backend Framework:** Flask
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
*   **Date Calculations:** `python-dateutil`