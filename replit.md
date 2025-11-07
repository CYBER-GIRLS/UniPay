# UniPay - Smart Student Digital Wallet

## Overview

UniPay is a digital wallet application tailored for students, integrating financial services with lifestyle features. It aims to provide a comprehensive solution for managing finances, subscriptions, savings, and peer-to-peer interactions within a student community. Key capabilities include secure digital payments, subscription management, student discounts, savings goal tracking, and peer-to-peer lending and marketplace functionalities. The project's ambition is to become an indispensable financial tool for students, offering convenience, security, and tailored benefits.

## User Preferences

No specific user preferences recorded yet. This section will be updated as development progresses.

## System Architecture

UniPay is built as a single-page application (SPA) with a clear separation between its backend and frontend.

**UI/UX Decisions:**
The frontend utilizes `shadcn/ui`, built on Radix UI and Tailwind CSS, ensuring a modern, accessible, and consistent design language. The application features distinct layouts for authenticated (`DashboardLayout`) and unauthenticated (`AuthLayout`) users, providing a structured user experience.

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