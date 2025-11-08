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
*   **Animations:** Framer Motion