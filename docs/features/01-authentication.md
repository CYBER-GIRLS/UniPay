# Authentication Feature

**Status:** ✅ **COMPLETED**

## Overview
The Authentication feature provides secure user registration, login, and session management using JWT tokens.

## Purpose
- Enable secure user account creation
- Manage user login sessions
- Protect routes and API endpoints
- Handle user authentication state

## Location
- **Frontend:** `src/features/auth/`
- **Backend:** `backend/app/blueprints/auth.py`
- **Store:** `src/store/authStore.ts`

## Components

### Pages
- **LoginPage** (`pages/LoginPage.tsx`)
  - Email and password login form
  - Form validation with React Hook Form + Zod
  - JWT token storage in localStorage
  - Redirect to dashboard on success
  
- **RegisterPage** (`pages/RegisterPage.tsx`)
  - User registration with email, username, password
  - PIN setup during registration
  - Account creation and automatic login

### Layout
- **AuthLayout** (`src/layouts/AuthLayout.tsx`)
  - Clean, centered layout for auth pages
  - Redirects authenticated users to dashboard

## Functionality

### Implemented Features ✅
- [x] User registration with validation
- [x] Email and password login
- [x] JWT token generation and storage
- [x] Automatic token attachment to API requests
- [x] Protected routes (redirect unauthenticated users)
- [x] Logout functionality
- [x] `/me` endpoint for user info retrieval
- [x] Zustand store for auth state management

### Backend Endpoints
```python
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Technical Implementation

### Frontend State Management
```typescript
// Zustand auth store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email, password) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

### Security Features
- JWT tokens with expiration
- Password hashing (bcrypt on backend)
- Protected API routes with `@jwt_required()`
- Automatic token refresh on app load
- Secure token storage in localStorage

### Form Validation
- Email format validation
- Password strength requirements (min 6 characters)
- Username uniqueness check
- Required field validation

## User Flow

### Registration
1. User fills registration form
2. Frontend validates inputs
3. POST request to `/api/auth/register`
4. Backend creates user, hashes password
5. JWT token returned
6. User redirected to dashboard

### Login
1. User enters credentials
2. POST request to `/api/auth/login`
3. Backend verifies credentials
4. JWT token returned and stored
5. Auth state updated
6. Redirect to dashboard

### Protected Routes
1. User tries to access protected page
2. DashboardLayout checks `isAuthenticated`
3. If false, redirect to `/login`
4. If true, render requested page

## Dependencies
- **Frontend:**
  - `react-hook-form` - Form management
  - `zod` - Schema validation
  - `zustand` - State management
  - `axios` - HTTP requests
  
- **Backend:**
  - `Flask-JWT-Extended` - JWT tokens
  - `Werkzeug` - Password hashing
  - `SQLAlchemy` - User model

## Database Schema
```sql
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(120) UNIQUE NOT NULL,
  username VARCHAR(80) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  pin_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
)
```

## Future Enhancements
- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Session timeout with refresh tokens
- [ ] Login attempt rate limiting
