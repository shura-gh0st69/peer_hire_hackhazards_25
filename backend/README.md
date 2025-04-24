# PeerHire Backend API Documentation

## Authentication API Routes

### POST /auth/signup
Register a new user (client or freelancer)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123",
  "name": "John Doe",
  "role": "freelancer",
  "profile": {
    // For Freelancers
    "skills": ["JavaScript", "React"],
    "bio": "Full-stack developer with 5 years of experience",
    "hourlyRate": 50,
    "location": "New York, USA"
    
    // For Clients
    "companySize": "10-50",
    "industry": "Technology",
    "companyLocation": "San Francisco, USA"
  }
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "freelancer",
    "profile": {
      // Profile fields based on role
    }
  }
}
```

### POST /auth/login
Login for existing users

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "freelancer",
    "profile": {
      // Profile fields based on role
    }
  }
}
```

### GET /auth/me
Get current user's profile (requires authentication)

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "freelancer",
    "profile": {
      // Profile fields based on role
    }
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "message": "Invalid email format",
      "path": ["email"]
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "error": "Invalid credentials"
}
```
or
```json
{
  "error": "No token provided"
}
```

### Not Found (404)
```json
{
  "error": "User not found"
}
```

### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

## Environment Variables

```env
# Required
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d
MONGODB_URI=mongodb://localhost:27017/freelancing_platform

# Optional (for demo mode)
DEMO_MODE=true
DEMO_CLIENT_EMAIL=demo.client@example.com
DEMO_CLIENT_PASSWORD=demoClient123
DEMO_FREELANCER_EMAIL=demo.freelancer@example.com
DEMO_FREELANCER_PASSWORD=demoFreelancer123
```

## Features

1. **Robust Input Validation**
   - Email format validation
   - Password strength requirements (min 8 chars, uppercase, lowercase, number)
   - Role-specific profile validation

2. **Security**
   - Password hashing using bcrypt
   - JWT-based authentication
   - Protected routes middleware

3. **Profile Management**
   - Role-specific profile fields
   - Optional profile completion during signup
   - Profile retrieval with authentication

4. **Demo Mode Support**
   - Configurable demo credentials
   - Bypass database for demo users
   - Separate demo flows for clients and freelancers

5. **Error Handling**
   - Detailed validation error messages
   - Proper HTTP status codes
   - Consistent error response format

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with the required environment variables.

3. Start the server:
```bash
npm start
```

The server will start on http://localhost:3000 by default.