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