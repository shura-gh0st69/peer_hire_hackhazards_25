import { Hono } from 'hono';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User';

const authRoutes = new Hono();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['client', 'freelancer'])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

authRoutes.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.errors }, 400);
    }

    const { email, password, name, role } = parsed.data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    return c.json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.errors }, 400);
    }

    const { email, password } = parsed.data;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    return c.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get current user route
authRoutes.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string };
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

export { authRoutes };