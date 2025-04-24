import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Interface for decoded JWT token
interface DecodedToken {
  id: string;
  email: string;
  role: 'client' | 'freelancer';
}

// Main authentication middleware
export const auth = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret'
    ) as DecodedToken;

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Add user to context for use in route handlers
    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

// Role-based middleware
export const requireRole = (roles: ('client' | 'freelancer')[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    if (!roles.includes(user.role)) {
      return c.json({ error: 'Unauthorized access' }, 403);
    }

    await next();
  };
};

// Specific role middlewares for convenience
export const requireClient = requireRole(['client']);
export const requireFreelancer = requireRole(['freelancer']);
export const requireAny = requireRole(['client', 'freelancer']);