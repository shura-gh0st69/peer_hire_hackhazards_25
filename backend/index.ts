import { Hono } from 'hono';
import { authRoutes } from './routes/auth';
import { auth, requireClient, requireFreelancer } from './middleware/auth';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import { secureHeaders } from 'hono/secure-headers';
import { rateLimiter } from 'hono-rate-limiter';

dotenv.config();

// Log all environment variables (excluding sensitive ones)
console.log('Environment Configuration:');
console.log('------------------------');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '**configured**' : 'missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '**configured**' : 'missing');
console.log('JWT_EXPIRATION:', process.env.JWT_EXPIRATION);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('DEMO_MODE:', process.env.DEMO_MODE);
console.log('------------------------');

// Function to anonymize IP addresses
function anonymizeIp(ip: string): string {
  if (ip.includes('.')) {
    const parts = ip.split('.');
    parts[3] = '0';
    return parts.join('.');
  } else if (ip.includes(':')) {
    const parts = ip.split(':');
    parts[parts.length - 1] = '0000';
    return parts.join(':');
  }
  return ip;
}

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
const frontendURL = process.env.FRONTEND_URL || 'https://hackhazards25-peer-hire.onrender.com';
const developmentOrigins = process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:5173'] : [];
const allowedOrigins = [...new Set([...frontendURL.split(',').map(origin => origin.trim()), ...developmentOrigins])];

console.log('CORS Configuration:');
console.log('Allowed Origins:', allowedOrigins);

const app = new Hono();

// Global error handler
app.onError((err, c) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  return c.json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  }, 500);
});

// Request logging middleware with more details
app.use('*', async (c, next) => {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${requestId} -> ${c.req.method} ${c.req.url}`);
  console.log('Headers:', Object.fromEntries(c.req.raw.headers.entries()));
  
  try {
    await next();
  } catch (err) {
    console.error(`[${requestId}] Error:`, err);
    throw err;
  }

  const duration = Date.now() - start;
  console.log(`[${new Date().toISOString()}] ${requestId} <- ${c.res.status} (${duration}ms)`);
});

// Enhanced security headers with more restrictive CSP
app.use('*', secureHeaders({
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
  xFrameOptions: 'DENY',
  xXssProtection: '1; mode=block',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'wasm-unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", ...allowedOrigins],
    fontSrc: ["'self'", 'https:', 'data:'],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
}));

// Enhanced rate limiting with different limits for various endpoints
app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: (c) => {
    const path = new URL(c.req.url).pathname;
    if (path.startsWith('/api/auth')) return 20;  // Stricter limits for auth
    if (path.startsWith('/api')) return 100;      // API endpoints
    return 200;                                   // Public endpoints
  },
  standardHeaders: 'draft-7',
  keyGenerator: (c) => {
    const ip = anonymizeIp(c.req.raw.headers.get('x-forwarded-for') || 
                          c.req.raw.headers.get('x-real-ip') || 
                          'unknown');
    const path = new URL(c.req.url).pathname;
    return `${ip}:${path}`;  // Rate limit per IP and path
  }
}));

// Enhanced CORS configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: [
    'Authorization',
    'Content-Type',
    'Accept',
    'Origin',
    'X-Requested-With',
    'X-API-Key'
  ],
  exposeHeaders: ['Content-Length', 'X-Rate-Limit'],
  maxAge: 86400,
  credentials: true,
}));

// Add cache control middleware
app.use('*', async (c, next) => {
  await next();
  if (c.req.method === 'GET') {
    c.header('Cache-Control', 'private, max-age=3600');
  } else {
    c.header('Cache-Control', 'no-store');
  }
});

// Spinup check endpoint
app.get('/spinup', (c) => c.json({ status: 'ok' }));

// Root route for server info
app.get('/', (c) => c.json({
  name: 'PeerHire API',
  version: '1.0.0',
  status: 'running',
  timestamp: new Date().toISOString()
}));

// Enhanced health check endpoint
app.get('/healthz', async (c) => {
  try {
    // Check MongoDB connection
    connectDB();
    return c.json({ status: 'ok', message: 'MongoDB connection successful & the server is running!' });
  } catch (error) {
    console.error('Health check error:', error);
    return c.json({ status: 'error', message: 'MongoDB connection failed' }, 500);
  }
});

// Enhanced MongoDB connection with retry logic
const connectDB = async (retries = 5) => {
  try {
    await connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }
    process.exit(1);
  }
};

// Public routes
app.route('/auth', authRoutes);

// Protected routes - require authentication
app.use('/api/*', auth);

// Example protected routes

// Client-only routes
app.get('/api/client/*', requireClient, (c) => {
  return c.json({ message: 'Client accessible' });
});

// Freelancer-only routes
app.get('/api/freelancer/*', requireFreelancer, (c) => {
  return c.json({ message: 'Freelancer accessible' });
});

// Default 404 route - must be last
app.notFound((c) => {
  return c.json({ 
    status: 'error',
    message: 'Route not found',
    path: c.req.path
  }, 404);
});

// Start server
serve({
  fetch: app.fetch,
  port,
});
console.log(`Server running on http://localhost:${port}`);