import { Hono } from 'hono';
import { connect } from 'mongoose';
import { authRoutes } from './routes/auth';
import { auth, requireClient, requireFreelancer } from './middleware/auth';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';

dotenv.config();

// Ensure required environment variables are set
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('MONGODB_URI environment variable not set');
  process.exit(1);
}
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('JWT_SECRET environment variable not set');
  process.exit(1);
}
const jwtExpiration = process.env.JWT_EXPIRATION;
if (!jwtExpiration) {
  console.error('JWT_EXPIRATION environment variable not set');
  process.exit(1);
}
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// CORS Configuration
// Get allowed origins from environment variables
// Support both single URL and comma-separated URLs
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:8080';
const allowedOrigins = frontendURL.split(',').map(origin => origin.trim());

const app = new Hono();

// Setup CORS middleware with support for multiple origins
app.use('*', cors({
  origin: (origin, c) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return null;
    
    // Check if the origin is in our allowed list
    return allowedOrigins.includes(origin) ? origin : null;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Authorization', 'Content-Type', 'Accept'],
  exposeHeaders: ['Content-Length', 'X-Powered-By'],
  maxAge: 86400,
  credentials: true,
}));

// MongoDB connection
const connectDB = async () => {
  try {
    await connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
connectDB();

// Public routes
app.route('/auth', authRoutes);

// Protected routes - require authentication
app.use('/api/*', auth);

// Example protected routes


// Client-only routes
app.get('/api/client/*', requireClient, (c) => {
  return c.json({ message: 'Client  accessible' });
});

// Freelancer-only routes
app.get('/api/freelancer/*', requireFreelancer, (c) => {
  return c.json({ message: 'Freelancer  accessible' });
});

// Start server
serve({
  fetch: app.fetch,
  port,
});
console.log(`Server running on http://localhost:${port}`);