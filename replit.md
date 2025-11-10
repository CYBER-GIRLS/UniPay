# UniPay - Smart Student Digital Wallet

## Overview
UniPay is a digital wallet application specifically designed for students, integrating financial services with lifestyle features. Its core purpose is to provide secure digital payments, subscription management, student discounts, savings goal tracking, and peer-to-peer lending and marketplace functionalities. UniPay aims to be an essential financial tool for students, offering convenience, security, customized benefits, and fostering financial literacy and independence.

## User Preferences
No specific user preferences recorded yet. This section will be updated as development progresses.

## System Architecture

UniPay is structured as a single-page application (SPA) with a clear separation between its backend and frontend components.

### UI/UX Decisions
The frontend features a modern, Revolut-inspired interface, built with `shadcn/ui` (Radix UI, Tailwind CSS). Key design elements include a fixed top navigation with a wallet icon logo, a fully responsive collapsible left sidebar that works across all devices (mobile, tablet, desktop), a modern color palette with violet/indigo gradients and pastel accents, card-based layouts with shadows and rounded corners, Framer Motion for animations, and a gradient balance card with quick action buttons. `DashboardLayout` is used for authenticated users and `AuthLayout` for unauthenticated users.

**Responsive Collapsible Sidebar:** The left sidebar is always visible and works consistently across all devices with:
- **Universal Availability:** Always positioned on the left side (no mobile bottom navigation)
- **Edge-to-Edge Layout:** Sidebar is flush to the left screen edge with no margins; TopNav is flush to the top and right edges
- **Responsive Widths:** Uses CSS clamp() for fluid sizing across devices:
  - Expanded: `clamp(12rem, 60vw, 16rem)` - adapts from 12rem (mobile) to 16rem (desktop)
  - Collapsed: `clamp(3.5rem, 15vw, 5rem)` - adapts from 3.5rem (mobile) to 5rem (desktop)
- **Touch-Friendly Controls:** 44px minimum touch targets for toggle button (h-11 w-11) and all navigation items (min-h-[44px])
- **Collapsible Behavior:** Toggle button with arrow icon (ChevronLeft/ChevronRight) works identically on all screen sizes
- **Responsive Elements:** Icons (h-5 w-5), labels (text-sm), and padding scale appropriately across breakpoints
- **Smart Display:** Collapsed state shows only icons with tooltips on hover; expanded state shows both icons and labels
- **Smooth Animations:** Framer Motion animations for width transitions, label reveal, and hover effects
- **Persistent State:** Collapse/expand preference maintained across navigation using Zustand store
- **Accessibility:** All navigation sections accessible in both collapsed and expanded states
- **Full-Viewport Layout:** DashboardLayout uses `h-screen w-screen m-0 p-0` with explicit margin/padding removal on html, body, and #root for a clean edge-to-edge design

**Dialog/Popup Scrolling Pattern:** All dialogs and popups use a standardized scrollable pattern to ensure proper viewport fitting:
- `DialogContent`: `flex flex-col max-h-[90vh]` - Sets max height at 90% viewport and flex layout
- `DialogHeader`: `flex-shrink-0` - Fixed header that doesn't scroll
- Content wrapper: `overflow-y-auto flex-1 pr-2` - Scrollable content area with right padding for scrollbar
- Applied to: EmergencyUnlockDialog, BudgetCardDetailDialog, PaymentCardDetailDialog, SubscriptionCardDetailDialog

**Dashboard Balance Card (Premium Bank Card Design):** The Available Balance section features a sleek, premium digital bank card design without borders, resembling an actual bank card with dynamic visual effects:
- **True Card Appearance:** No white border/frame - direct rendering as standalone card with natural height, `max-w-4xl` width, centered layout
- **Premium Shadows:** Soft drop shadow `shadow-[0_8px_30px_rgb(0,0,0,0.12)]` with elevated hover state `shadow-[0_15px_40px_rgb(0,0,0,0.18)]` for depth
- **Diagonal Gradient:** Background uses `bg-gradient-to-br from-primary via-purple-500/90 to-secondary` with multiple glassmorphic overlays for illuminated feel
- **Geometric Overlays:** Subtle dynamic aesthetic with:
  - Multiple circular gradients (top-right, bottom-left, center) at varying opacities for depth
  - SVG layer with grid pattern, decorative circles, and curved wave path (all at 3-10% opacity)
  - Creates minimalist yet sophisticated appearance
- **Animated Shimmer Effect:** Moving white light reflection that slides across card surface:
  - Skewed gradient (`from-transparent via-white/20 to-transparent`) with diagonal motion
  - 3-second animation, 2-second delay, infinite repeat
  - Respects `prefers-reduced-motion` - shows static centered highlight when motion reduction is preferred
  - Creates premium texture and sense of depth
- **Card Elements:**
  - EMV chip icon (top-left): `ScanLine` icon with golden gradient (`from-amber-200 via-yellow-100 to-amber-300`)
  - Wallet branding icon (top-right): `Wallet` icon with glassmorphic background (`bg-white/15 backdrop-blur-sm`)
  - Both icons are `aria-hidden="true"` and responsive (`h-5 w-5 → sm:h-6 sm:w-6`)
- **Balance Typography:** Clean hierarchy with responsive scaling:
  - Label: `text-xs sm:text-sm uppercase tracking-wide`
  - Amount: `text-4xl → sm:text-5xl → md:text-6xl font-bold tracking-tight`
  - Currency: `text-xs sm:text-sm font-medium`
  - Includes `aria-live="polite"` for balance updates
- **Action Buttons Inside Card:** Positioned at bottom with glassmorphic styling:
  - Grid layout: `grid-cols-1 xs:grid-cols-3` - stacks on mobile, horizontal on small screens+
  - Button style: `bg-white/20 hover:bg-white/30` with `border border-white/30` and `backdrop-blur-sm`
  - All three buttons (Top Up, Transfer, Cards) use consistent glassmorphic design
  - Touch-friendly: All buttons have `min-h-[44px]` touch targets
- **Responsive Design:** Responsive padding (`p-6 sm:p-8 md:p-10`), 2xl rounded corners, geometric shapes scale with screen size
- **Animations:** Spring-based hover effects (`whileHover={{ scale: 1.03 }}`) and entrance animations via Framer Motion, all respecting accessibility preferences

### Technical Implementations

*   **Backend:** Developed using Flask (Python), employing SQLAlchemy for ORM (PostgreSQL), Flask-JWT-Extended for authentication, and Flask-SocketIO for real-time features. It utilizes an Application Factory Pattern and Flask Blueprints for modularity, incorporating security measures like JWT, password hashing, PIN protection, and CORS.
*   **Frontend:** Built with React 18 and Vite. State management is handled by Zustand (client-side stores: authentication, sidebar state, currency) and TanStack Query (server-side data). Axios manages HTTP requests with JWT interceptors, and React Router DOM handles navigation.
*   **Feature Specifications:**
    *   **Authentication:** User registration, login, JWT token management, PIN setup, and visual-only forgot password and social login features. Includes default PIN system with secure change functionality and security warnings for default PIN usage.
    *   **Wallet:** Balance display, top-up functionality, peer-to-peer transfers, and visual multi-currency support with transfer scheduling.
    *   **Transactions:** Comprehensive tracking, filtering, and statistical analysis with 15+ transaction types. Supports "expected payments" (CRUD and recurring instances) and includes balance validation, race condition protection, and detailed transaction records with metadata.
    *   **Virtual Cards:** Creation, management (freeze/unfreeze), and linking to subscriptions. Card payments include freeze/limit checks.
    *   **Subscriptions:** Management of recurring payments.
    *   **Savings & Goals:** Dedicated goal tracking system for financial objectives. Users can create savings goals with target amounts, track progress with visual indicators, and make contributions. Features editable target amounts, dynamic progress bars showing completion percentage, and goal completion celebrations.
    *   **DarkDays Pocket:** Separate dedicated module for secure, PIN-protected savings pockets with auto-save options. Features a consolidated settings interface combining savings configuration and auto-save settings with a single Save button. Includes emergency withdrawal flow with metadata tracking and security verification.
    *   **Marketplace:** Student-to-student commerce platform supporting listings and escrow services with buyer balance validation and dual transaction recording.
    *   **P2P Lending:** Request-approval based peer-to-peer lending system with: (1) **Request System** - Borrowers create loan requests (no immediate money transfer), lenders receive requests in "Pending Requests" tab with approve/decline actions. (2) **Approval Workflow** - Lenders approve requests to transfer funds (pending → active), or decline to reject (pending → declined). Money only transfers upon approval, not during request creation. (3) **Categorized Dashboard** - Four tabs: "Pending Requests" (received), "My Requests" (sent), "I Owe" (active borrowing), "Owed to Me" (active lending). (4) **Summary Statistics** - Real-time "Owed to Me" and "I Owe" calculations excluding pending/cancelled/declined loans, with net balance tracking. (5) **Loan Lifecycle** - Complete status tracking: pending → active → repaid, with support for cancelled (lender) and declined (lender) states. (6) **Smart Actions** - Role-based buttons: lenders can approve/decline pending requests, cancel active loans with zero repayments, send reminders; borrowers can repay active loans. (7) **Visual Indicators** - Status badges (pending-blue, active-outline, declined-red, cancelled-gray, overdue-red, repaid-green), circular progress indicators showing repayment percentage or checkmark when fully repaid. (8) **Security** - Balance validation before transfers, row-level locking for race condition protection, dual transaction recording for both parties, status-based permission enforcement. Includes comprehensive error handling and real-time UI synchronization via TanStack Query.
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