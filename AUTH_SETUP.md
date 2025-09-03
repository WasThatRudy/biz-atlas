# Authentication Setup for BizAtlas

This document describes the authentication implementation for the BizAtlas application.

## Overview

The authentication system has been implemented with the following features:
- User signup and login
- JWT token management
- Protected routes
- Persistent authentication state
- Client-side authentication service

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the `bizatlas` directory with:

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:3000
```

### 2. Backend Service

Ensure your backend service is running on `http://localhost:3000` with the following endpoints:
- `POST /signup/signup` - User registration
- `POST /signup/login` - User login

### 3. Dependencies

All required dependencies are already installed:
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Form validation
- `zod` - Schema validation
- `lucide-react` - Icons

## Features Implemented

### Authentication Service (`lib/auth.ts`)
- Singleton service for authentication operations
- JWT token storage in localStorage
- Automatic token expiration checking
- User session management

### Authentication UI (`components/auth/auth-form.tsx`)
- Combined login/signup form with validation
- Error handling and user feedback
- Responsive design matching the app's newspaper theme

### Authentication Page (`app/auth/page.tsx`)
- Dedicated authentication page
- Mode switching between login and signup
- Automatic redirect to dashboard on success

### Authentication Context (`lib/auth-context.tsx`)
- React context for authentication state
- Hooks for accessing auth state across components
- Persistent authentication state

### Protected Routes (`components/auth/protected-route.tsx`)
- Higher-order component for protecting routes
- Automatic redirect to auth page for unauthenticated users
- Loading states during authentication checks

### Updated Navigation (`components/navigation.tsx`)
- User status display
- Logout functionality
- Conditional rendering based on auth state

## Protected Pages

The following pages are now protected and require authentication:
- `/dashboard` - User dashboard
- `/setup` - Project setup
- `/analysis` - Analysis page
- `/competitors` - Competitor selection
- `/report/[reportId]` - Individual reports

## Usage

### For Unauthenticated Users
1. Visit the home page (`/`)
2. Click "Login" or "Sign Up" in the navigation
3. Complete the authentication form
4. Get redirected to the dashboard

### For Authenticated Users
1. Users are automatically redirected to `/dashboard` from the home page
2. Authentication state persists across browser sessions
3. Users can logout using the logout button in navigation

## API Integration

The authentication service makes direct calls to the backend API:

```typescript
// Signup
POST /signup/signup
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name" // optional
}

// Login
POST /signup/login
{
  "email": "user@example.com", 
  "password": "password123"
}
```

Both endpoints return:
```typescript
{
  "success": boolean,
  "message": string,
  "data": {
    "token": string,
    "user": {
      "id": string,
      "email": string,
      "name": string
    }
  }
}
```

## Security Features

- JWT tokens stored in localStorage
- Automatic token expiration checking
- Password validation (minimum 6 characters)
- Email validation
- Input sanitization
- Error handling for network issues

## Development Notes

Since this is a static export app (`output: 'export'`), all authentication is handled client-side. The app directly calls the backend API instead of using Next.js API routes.

## Testing

1. Start the backend service on port 3000
2. Run the frontend with `npm run dev`
3. Test signup with a new email
4. Test login with existing credentials
5. Verify protected routes redirect to auth page when not logged in
6. Verify authenticated users can access all pages
