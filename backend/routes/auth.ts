import { Hono } from 'hono';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET!;
const jwtExpiration = process.env.JWT_EXPIRATION!;

const authRoutes = new Hono();

const freelancerProfileSchema = z.object({
  skills: z.array(z.string()).optional(),
  bio: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
  location: z.string().optional(),
});

const clientProfileSchema = z.object({
  companySize: z.string().optional(),
  industry: z.string().optional(),
  companyLocation: z.string().optional(),
});

const baseSignup = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const clientSignupSchema = baseSignup.extend({
  role: z.literal('client'),
  profile: clientProfileSchema.optional(),
});

const freelancerSignupSchema = baseSignup.extend({
  role: z.literal('freelancer'),
  profile: freelancerProfileSchema.optional(),
});

const signupSchema = z.discriminatedUnion('role', [
  clientSignupSchema,
  freelancerSignupSchema,
]);

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

authRoutes.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: 'Validation failed', details: parsed.error.errors }, 400);
    }

    const { email, password, name, role, profile } = parsed.data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with profile data directly (not nested)
    const userData = {
      email,
      password: hashedPassword,
      name,
      role,
    };
    
    // Add profile fields directly to the base object, not as a nested object
    if (profile) {
      if (role === 'client') {
        Object.assign(userData, {
          companySize: profile.companySize,
          industry: profile.industry,
          companyLocation: profile.companyLocation
        });
      } else if (role === 'freelancer') {
        Object.assign(userData, {
          skills: profile.skills,
          bio: profile.bio,
          hourlyRate: profile.hourlyRate,
          location: profile.location
        });
      }
    }
    
    // Create and save the user
    const user = new User(userData);
    await user.save();
    
    // Fetch the newly created user to confirm all data was saved
    const savedUser = await User.findById(user._id).lean();
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );

    // Format the response with profile data from the saved user
    const profileData = role === 'client' 
      ? {
          companySize: savedUser?.companySize,
          industry: savedUser?.industry,
          companyLocation: savedUser?.companyLocation,
        }
      : {
          skills: savedUser?.skills,
          bio: savedUser?.bio,
          hourlyRate: savedUser?.hourlyRate,
          location: savedUser?.location,
        };

    return c.json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: profileData
      }
    }, 201);
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: 'Validation failed', details: parsed.error.errors }, 400);
    }

    const { email, password } = parsed.data;

    // Check for demo credentials
    if (process.env.DEMO_MODE === 'true') {
      const isDemoClient = email === process.env.DEMO_CLIENT_EMAIL && password === process.env.DEMO_CLIENT_PASSWORD;
      const isDemoFreelancer = email === process.env.DEMO_FREELANCER_EMAIL && password === process.env.DEMO_FREELANCER_PASSWORD;
      
      if (isDemoClient || isDemoFreelancer) {
        const role = isDemoClient ? 'client' : 'freelancer';
        const token = jwt.sign(
          { id: 'demo-user', email, role },
          jwtSecret,
          { expiresIn: jwtExpiration }
        );
        
        return c.json({
          token,
          user: {
            id: 'demo-user',
            email,
            name: `Demo ${role}`,
            role,
          }
        });
      }
    }

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
      jwtSecret,
      { expiresIn: jwtExpiration }
    );

    return c.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: {
          ...(user.role === 'freelancer' ? {
            skills: user.skills,
            bio: user.bio,
            hourlyRate: user.hourlyRate,
            location: user.location,
          } : {
            companySize: user.companySize,
            industry: user.industry,
            companyLocation: user.companyLocation,
          })
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
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
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ 
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: {
          ...(user.role === 'freelancer' ? {
            skills: user.skills,
            bio: user.bio,
            hourlyRate: user.hourlyRate,
            location: user.location,
          } : {
            companySize: user.companySize,
            industry: user.industry,
            companyLocation: user.companyLocation,
          })
        }
      } 
    });
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

export { authRoutes };