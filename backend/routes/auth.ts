import { Hono } from 'hono';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User';
import { Activity } from '../models/Activity';
import { Job } from '../models/Job';
import { Bid } from '../models/Bid';
import { Contract } from '../models/Contract';
import { Payment } from '../models/Payment';
import { auth } from '../middleware/auth';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET!;
const jwtExpiration = process.env.JWT_EXPIRATION!;

const authRoutes = new Hono();

const freelancerProfileSchema = z.object({
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  bio: z.string()
    .min(50, 'Professional bio should be at least 50 characters')
    .max(500, 'Professional bio cannot exceed 500 characters'),
  hourlyRate: z.number()
    .positive('Hourly rate must be positive')
    .min(1, 'Please enter your hourly rate')
    .max(1000, 'Hourly rate cannot exceed $1000'),
  location: z.string()
    .min(2, 'Please enter your location')
    .max(100, 'Location is too long'),
});

const clientProfileSchema = z.object({
  companySize: z.string()
    .min(1, 'Please select your company size')
    .refine(size => ['1-10', '11-50', '51-200', '201-500', '500+'].includes(size), 
      'Please select a valid company size'),
  industry: z.string()
    .min(1, 'Please select your industry')
    .refine(ind => ['Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Other'].includes(ind),
      'Please select a valid industry'),
  companyLocation: z.string()
    .min(2, 'Please enter your company location')
    .max(100, 'Company location is too long'),
  bio: z.string()
    .min(50, 'Company description should be at least 50 characters')
    .max(500, 'Company description cannot exceed 500 characters')
    .optional(),
});

const baseSignup = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email is too short')
    .max(100, 'Email is too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long'),
});

const clientSignupSchema = baseSignup.extend({
  role: z.literal('client'),
  profile: clientProfileSchema,
});

const freelancerSignupSchema = baseSignup.extend({
  role: z.literal('freelancer'),
  profile: freelancerProfileSchema,
});

const signupSchema = z.discriminatedUnion('role', [
  clientSignupSchema,
  freelancerSignupSchema,
]);

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

authRoutes.post('/client/signup', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = clientSignupSchema.safeParse(body);

    if (!parsed.success) {
      const errorDetails = parsed.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      return c.json({ 
        error: 'Validation failed', 
        details: errorDetails
      }, 400);
    }

    const { email, password, name, profile } = parsed.data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ 
        error: 'User already exists',
        details: [{ path: 'email', message: 'This email is already registered' }]
      }, 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create client user with profile data
    const userData = {
      email,
      password: hashedPassword,
      name,
      role: 'client',
      companySize: profile?.companySize || '',
      industry: profile?.industry || '',
      companyLocation: profile?.companyLocation || '',
      bio: profile?.bio || ''
    };

    const user = new User(userData);
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );

    return c.json({
      message: "Client account created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: {
          companySize: user.companySize,
          industry: user.industry,
          companyLocation: user.companyLocation,
          bio: user.bio
        }
      }
    }, 201);

  } catch (error) {
    console.error('Client signup error:', error);
    return c.json({ 
      error: 'Internal server error',
      details: [{ path: 'server', message: 'Something went wrong, please try again' }]
    }, 500);
  }
});

authRoutes.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const errorDetails = parsed.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      return c.json({ 
        error: 'Validation failed', 
        details: errorDetails
      }, 400);
    }

    const { email, password, name, role, profile } = parsed.data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ 
        error: 'User already exists',
        details: [{ path: 'email', message: 'This email is already registered' }]
      }, 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with profile data
    const userData = {
      email,
      password: hashedPassword,
      name,
      role,
      ...(role === 'freelancer' ? {
        skills: profile?.skills || [],
        bio: profile?.bio || '',
        hourlyRate: profile?.hourlyRate || 0,
        location: profile?.location || ''
      } : {
        companySize: profile?.companySize || '',
        industry: profile?.industry || '',
        companyLocation: profile?.companyLocation || '',
        bio: profile?.bio || ''
      })
    };

    const user = new User(userData);
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );

    return c.json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: role === 'freelancer' ? {
          skills: user.skills,
          bio: user.bio,
          hourlyRate: user.hourlyRate,
          location: user.location,
        } : {
          companySize: user.companySize,
          industry: user.industry,
          companyLocation: user.companyLocation,
          bio: user.bio,
        }
      }
    }, 201);

  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ 
      error: 'Internal server error',
      details: [{ path: 'server', message: 'Something went wrong, please try again' }]
    }, 500);
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
            bio: user.bio,
          })
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update the Context interface
declare module 'hono' {
  interface ContextVariableMap {
    user: IUser;
  }
}

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
            bio: user.bio,
          })
        }
      } 
    });
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// Get user profile data
authRoutes.get('/profile/:userId', auth, async (c) => {
  try {
    const userId = c.req.param('userId');
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Get user statistics based on role
    let stats = {};
    if (user.role === 'freelancer') {
      const completedJobs = await Contract.countDocuments({ 
        freelancerId: user._id, 
        status: 'completed' 
      });
      
      const totalEarnings = await Payment.aggregate([
        { $match: { freelancerId: user._id, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const avgRating = await Contract.aggregate([
        { $match: { freelancerId: user._id, status: 'completed' } },
        { $group: { _id: null, rating: { $avg: '$rating' } } }
      ]);

      stats = {
        completedJobs,
        totalEarnings: totalEarnings[0]?.total || 0,
        rating: avgRating[0]?.rating || 0,
      };
    } else {
      const jobsPosted = await Job.countDocuments({ clientId: user._id });
      const totalSpent = await Payment.aggregate([
        { $match: { clientId: user._id, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      stats = {
        jobsPosted,
        totalSpent: totalSpent[0]?.total || 0
      };
    }

    // Construct profile response
    const profile = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      ...(user.role === 'freelancer' ? {
        bio: user.bio,
        hourlyRate: user.hourlyRate,
        location: user.location,
        skills: user.skills,
        stats
      } : {
        industry: user.industry,
        companySize: user.companySize,
        companyLocation: user.companyLocation,
        bio: user.bio,
        stats
      })
    };

    return c.json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile data' }, 500);
  }
});

// Get user dashboard data
authRoutes.get('/dashboard', auth, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Fetch user's dashboard data based on role
    if (user.role === 'freelancer') {
      // Get freelancer dashboard data
      const dashboardData = {
        name: user.name,
        ongoingProjects: await Contract.countDocuments({ freelancerId: user._id, status: 'active' }),
        activeApplications: await Bid.countDocuments({ freelancerId: user._id, status: 'pending' }),
        totalEarnings: await Payment.aggregate([
          { $match: { freelancerId: user._id, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        recentActivities: await Activity.find({ userId: user._id })
          .sort({ createdAt: -1 })
          .limit(5),
        recommendedJobs: await Job.find({
          skills: { $in: user.skills },
          status: 'open'
        })
        .sort({ createdAt: -1 })
        .limit(5)
      };

      return c.json({ freelancer: dashboardData });
    } else {
      // Get client dashboard data
      const dashboardData = {
        name: user.name,
        activeJobs: await Job.countDocuments({ clientId: user._id, status: 'active' }),
        totalSpent: await Payment.aggregate([
          { $match: { clientId: user._id, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        escrowBalance: await Payment.aggregate([
          { $match: { clientId: user._id, status: 'escrow' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        recentActivities: await Activity.find({ userId: user._id })
          .sort({ createdAt: -1 })
          .limit(5),
        pendingBids: await Bid.find({ jobId: { $in: await Job.find({ clientId: user._id }).distinct('_id') } })
          .populate('freelancerId', 'name rating')
          .sort({ createdAt: -1 })
          .limit(5)
      };

      return c.json({ client: dashboardData });
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

authRoutes.patch('/users/profile', auth, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { name, email, walletAddress, profile } = body;

    // Update basic info
    user.name = name || user.name;
    user.email = email || user.email;
    user.walletAddress = walletAddress || user.walletAddress;

    // Update role-specific profile data
    if (user.role === 'freelancer') {
      user.skills = profile.skills || user.skills;
      user.bio = profile.bio || user.bio;
      user.hourlyRate = profile.hourlyRate || user.hourlyRate;
      user.location = profile.location || user.location;
    } else {
      user.companySize = profile.companySize || user.companySize;
      user.industry = profile.industry || user.industry;
      user.companyLocation = profile.companyLocation || user.companyLocation;
      user.bio = profile.bio || user.bio;
    }

    await user.save();

    return c.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        walletAddress: user.walletAddress,
        profile: user.role === 'freelancer' ? {
          skills: user.skills,
          bio: user.bio,
          hourlyRate: user.hourlyRate,
          location: user.location,
        } : {
          companySize: user.companySize,
          industry: user.industry,
          companyLocation: user.companyLocation,
          bio: user.bio,
        }
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

export { authRoutes };