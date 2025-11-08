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

**November 8, 2025 (Finance Timeline - Transaction Calendar):**
- ✅ **Comprehensive documentation** - docs/features/17-finance-timeline.md with complete specifications
- ✅ **Calendar view component** - Monthly calendar grid with smooth month navigation  
- ✅ **Color-coded transaction indicators** - 🔴 Red (expense), 🟢 Green (income), 🟡 Yellow (upcoming), 🔴🟢 Mixed
- ✅ **Color legend** - Fixed legend explaining all transaction types
- ✅ **Day detail modal** - Click any day to see detailed transaction list with totals
- ✅ **Transaction grouping** - Smart grouping by date with income/expense calculation
- ✅ **Today highlight** - Current date highlighted with violet border
- ✅ **Responsive design** - Mobile-friendly calendar with touch-optimized interactions
- ✅ **Smooth animations** - Framer Motion transitions for calendar and modal
- ✅ **Navigation integration** - Accessible via sidebar with CalendarDays icon
- 📋 **Pending** - API endpoint for calendar data, upcoming payments integration

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

**November 8, 2025 (ISIC Partner Merchants - Enhanced Category Filtering):**
- ✅ **Comprehensive category system** - 11 categories: All categories, Accommodation, Culture, Entertainment, Food and drink, Services, Shopping, Sport, Study, Travel, Other
- ✅ **Frontend filtering** - Updated MerchantsList component with new category filter buttons
- ✅ **Category mapping** - Migrated legacy categories (Food→Food and drink, Retail→Shopping, Sports→Sport, Education→Study, Transport→Travel)
- ✅ **Database migration** - Created migrate_categories.py script to update existing merchant records
- ✅ **Seed data update** - Updated all merchants in seed_merchants.py with new category taxonomy
- ✅ **Special categorization** - City Museum moved from Entertainment to Culture for better accuracy
- ✅ **Accommodation merchants** - Added 5 accommodation partners (Хотел Kitchen59, хотел Перелик 5*, Хотел Балканско Бижу, Хотел Фламинго, Homestay)
- ✅ **Culture merchants** - Added 5 culture partners (Historical Park, Museum of Illusions, Castle Ravadinovo, Sofia Opera and Ballet, Regional Archaeological Museum)
- ✅ **Entertainment merchants** - Added 5 entertainment partners (GIFT TUBE, Funky Monkeys - Escape HUB, ALCOHOPOLY, Escape Project - Illusion, CLWD/EXE Club)
- ✅ **Food and drink merchants** - Updated 3 existing (KFC, Subway, Starbucks) and added 2 new (Пица и Вино - Студентски град, Jagermeister Online Shop), removed McDonald's
- ✅ **Services merchants** - Added 5 services partners (Volt Premium Taxi, Diana Tires, Kandilarov Laboratory, MANIA PRINT, SALT ME - солни стаи)
- ✅ **Shopping merchants** - Added 5 shopping partners (Elephant Bookstore, Bookspace, Lenovo Exclusive Store, Grand Optics, Sport Box)
- ✅ **Sport merchants** - Added 5 sport partners (Under Armour, Sofia Karting Ring, AREA 52 - Park, GymBeam, Fit City)
- ✅ **Study merchants** - Added 5 study partners (JetBrains, Hacker4e Programming Academy for Children, Telerik Academy, Kabinata, Lingua Mundi Language Center)
- ✅ **Travel merchants** - Added 5 travel partners (Bulgarian State Railways, Usit Colours, FlixBUS, Kiwi, QATAR Airways)
- ✅ **Other merchants** - Added 5 other category partners (OMV Gas Stations, Mastercard Day Cashback, Imotiko Real Estate, Enigma Aesthetic Center, Sexwell)
- ✅ **Active categories** - 10 active categories across 61 merchants (Accommodation, Culture, Entertainment, Food and drink, Other, Services, Shopping, Sport, Study, Travel)
- ✅ **Merchant distribution** - Shopping (9), Entertainment (7), Sport (7), Culture (6), Study (6), Travel (6), Accommodation (5), Food and drink (5), Other (5), Services (5)

**November 8, 2025 (ISIC Card Screenshot Upload - Privacy-First Feature):**
- ✅ **Comprehensive documentation** - docs/features/20-isic-card-screenshot-upload.md with 400+ lines
- ✅ **On-device OCR processor** - Tesseract.js for privacy-first text extraction with intelligent field parsing
- ✅ **ISICCardUploadModal component** - Multi-step wizard (Upload → Process → Review → Complete)
- ✅ **ISICCardFields component** - Form with validation for reviewing/editing extracted card data
- ✅ **Privacy controls** - Server upload opt-in only, defaults to on-device processing
- ✅ **Smart field extraction** - Detects card number, name, dates, institution, card type
- ✅ **Backend API endpoints** - POST /api/isic/upload, GET/PATCH/DELETE /api/isic/metadata
- ✅ **ISICCardMetadata model** - Database model for storing optional card metadata
- ✅ **Upload button** - Appears after successful ISIC card linking with clear call-to-action
- ✅ **Success state UI** - Green success message + blue info card explaining upload benefits
- ✅ **Image preprocessing** - Auto-resize and grayscale conversion for better OCR accuracy
- ✅ **Validation & error handling** - Zod schema validation with clear error messages
- ✅ **CRITICAL FIX #1** - Fixed ISICCardMetadata model ForeignKey table name references (user→users, virtual_card→virtual_cards) that were breaking ALL database queries
- ✅ **CRITICAL FIX #2** - Fixed ISICCardUploadModal using wrong localStorage key for JWT token (token→access_token) that prevented saving card data
- ✅ **Screenshot viewing** - "View ISIC Card" button in UploadedISICCardView displays uploaded screenshot in modal dialog
- ✅ **Query invalidation** - Automatic refresh of uploaded card data after successful save
- ✅ **JWT authentication fix** - UploadedISICCardView now uses isicAPI.getUploadedCardMetadata() with proper JWT token
- ✅ **Screenshot visibility fix** - Backend always returns screenshot_url regardless of verification status (not just for verified cards)
- ✅ **Uploaded card display** - Complete metadata display with verification status, card details, and screenshot access
- ✅ **Dialog UX** - Clean screenshot viewer with close button and responsive design
- ✅ **Auto-verification** - Changed default verification_status from 'pending' to 'verified' for instant approval
- ✅ **Database screenshot storage** - Screenshots stored directly in database as base64 TEXT data (more reliable than object storage)
- ✅ **Screenshot persistence** - Base64 images saved to screenshot_url column and retrieved directly from database
- ✅ **Base64 retrieval** - GET /api/isic/metadata returns screenshot_base64 field with full data URI for image display
- ✅ **Frontend integration** - UploadedISICCardView displays screenshots from screenshot_base64 field
- ✅ **Error handling** - Graceful fallback if screenshot retrieval fails, preventing application crashes
- ✅ **ISIC Profile linking** - Added isic_profile_id foreign key to link uploaded metadata to user's ISIC profile
- ✅ **Automatic linking** - Upload API automatically links new uploads to user's existing ISIC profile
- ✅ **Model relationships** - ISICCardMetadata now has relationship to ISICProfile for data integration
- ✅ **Automatic profile syncing** - Uploaded screenshot data automatically updates ISIC profile (card number, name, institution, expiry date)
- ✅ **CRITICAL FIX #3** - Fixed duplicate metadata bug: Upload logic now UPDATES existing user metadata instead of creating duplicate records on re-upload
- ✅ **Update vs Create logic** - System checks for existing metadata by user_id and updates in place, preventing multiple records per user
- ✅ **Updated_at timestamp** - Existing records now properly update their updated_at timestamp when modified
