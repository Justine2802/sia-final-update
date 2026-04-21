# Authentication Guide

## Login Credentials

### Admin Login
- **Email**: `admin@sia.com`
- **Password**: `admin123`
- **Role**: Admin
- **Access**: Full system access - manage residents, programs, incidents, certificates, and enrollments

### Resident Login
- **Email**: Any email address (e.g., `resident@email.com`)
- **Password**: Any password with 6+ characters
- **Role**: Resident
- **Access**: View personal profile, enrolled programs, and certificates

## Features by Role

### Admin Features
- Dashboard with system statistics
- Residents management (CRUD)
- Programs management
- Incident reporting and tracking
- Certificate issuance
- Enrollment management
- View all system data

### Resident Features
- Personal dashboard with summary
- View enrolled programs
- View issued certificates
- View personal profile information
- Account verification status

## Authentication System

### How It Works
1. **Login Page**: First screen when no user is authenticated
2. **Session Management**: User data stored in localStorage
3. **Protected Routes**: Routes automatically redirect to login if not authenticated
4. **Role-Based Access**: Different UI and features based on user role
5. **Logout**: Clears session and returns to login page

### Security Notes (Development)
⚠️ **Important**: This is a development/demo authentication system.

For production:
- Implement backend API authentication
- Use JWT tokens with expiration
- Implement refresh token mechanism
- Hash passwords properly
- Use HTTPS only
- Implement rate limiting on login attempts
- Add multi-factor authentication (MFA)
- Store sensitive data in secure storage

## Current Implementation

### Frontend Storage
User data is stored in browser localStorage:
```javascript
{
  id: 1,
  name: "Administrator",
  email: "admin@sia.com",
  role: "admin"
}
```

### Authentication Context
- Located in `src/contexts/AuthContext.jsx`
- Provides `useAuth()` hook for accessing auth state
- Functions: `login()`, `logout()`
- Persists user across page refreshes

## Next Steps for Production

1. **Backend Integration**
   - Create login API endpoint
   - Implement JWT authentication
   - Add password hashing (bcrypt)
   - Create user registration endpoint

2. **Security Enhancements**
   - Add CSRF protection
   - Implement rate limiting
   - Add input validation
   - Use secure cookies

3. **User Management**
   - User registration system
   - Password reset functionality
   - Email verification
   - Account lockout after failed attempts

4. **Testing**
   - Unit tests for auth context
   - Integration tests for protected routes
   - Security testing for authentication flows
