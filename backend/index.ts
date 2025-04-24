import { Hono } from 'hono';
import { connect } from 'mongoose';
import { authRoutes } from './routes/auth';
import { auth, requireClient, requireFreelancer, requireAny } from './middleware/auth';
import { serve } from '@hono/node-server';

const app = new Hono();

// MongoDB connection
const connectDB = async () => {
  try {
    await connect('mongodb://localhost:27017/freelancing_platform');
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
app.get('/api/client/projects', requireClient, (c) => {
  return c.json({ message: 'Client projects accessible' });
});

// Freelancer-only routes
app.get('/api/freelancer/jobs', requireFreelancer, (c) => {
  return c.json({ message: 'Freelancer jobs accessible' });
});

// Start server
serve({
  fetch: app.fetch,
  port: 3000,
});
console.log('Server running on http://localhost:3000');