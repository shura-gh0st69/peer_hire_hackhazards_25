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

// Request logging middleware
const requestLogger = async (c, next) => {
  const start = Date.now();
  const { method, url } = c.req;
  const requestId = crypto.randomUUID();

  console.log(`[${new Date().toISOString()}] ${requestId} -> ${method} ${url}`);

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;
  console.log(
    `[${new Date().toISOString()}] ${requestId} <- ${method} ${url} ${status} ${duration}ms`
  );
};

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
// Get allowed origins from environment variables
// Support both single URL and comma-separated URLs
let frontendURL = process.env.FRONTEND_URL || 'https://hackhazards25-peer-hire.onrender.com';
// Convert to array if comma-separated string
const allowedOrigins = frontendURL.split(',').map(origin => origin.trim());

console.log('Allowed Origins:', allowedOrigins);

const app = new Hono();

// Add request logging middleware before other middleware
app.use('*', requestLogger);

// Enhanced security headers
app.use('*', secureHeaders({
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
  xFrameOptions: 'DENY',
  xXssProtection: '1; mode=block',
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:'],
    objectSrc: ["'none'"],
  },
}));

// Rate limiting middleware
app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  keyGenerator: (c) => {
    return anonymizeIp(c.req.raw.headers.get('x-forwarded-for') || 'unknown');
  }
}));

// Setup CORS middleware with support for multiple origins
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return '*';
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    return null;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Requested-With', 'Origin'],
  exposeHeaders: ['Content-Length', 'X-Powered-By'],
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
  return c.json({ message: 'Client  accessible' });
});

// Freelancer-only routes
app.get('/api/freelancer/*', requireFreelancer, (c) => {
  return c.json({ message: 'Freelancer  accessible' });
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