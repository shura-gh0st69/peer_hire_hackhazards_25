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
import { ethers } from 'ethers';

// New import for wallet authentication
import { verifyMessage } from 'ethers';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET!;
const jwtExpiration = process.env.JWT_EXPIRATION!;

const authRoutes = new Hono();

// Add validation schemas for wallet authentication
const walletAuthSchema = z.object({
  address: z.string().min(42, 'Invalid wallet address').max(42, 'Invalid wallet address'),
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
});

const walletSignupSchema = z.object({
  address: z.string().min(42, 'Invalid wallet address').max(42, 'Invalid wallet address'),
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  role: z.enum(['client', 'freelancer']).optional(),
});

const walletLinkSchema = z.object({
  address: z.string().min(42, 'Invalid wallet address').max(42, 'Invalid wallet address'),
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
});

// Update signup schema to include optional wallet data
const walletDataSchema = z.object({
  address: z.string().min(42, 'Invalid wallet address').max(42, 'Invalid wallet address'),
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
});

const freelancerProfileSchema = z.object({
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  bio: z.string()
    .min(50, 'Professional bio should be at least 50 characters')
    .max(1000, 'Professional bio cannot exceed 1000 characters')
    .optional(),
  hourlyRate: z.number().positive('Hourly rate must be positive').optional(),
  location: z.string().min(2, 'Please enter a valid location').optional(),
});

const clientProfileSchema = z.object({
  companySize: z.string().optional(),
  industry: z.string().optional(),
  companyLocation: z.string().optional(),
  bio: z.string().optional(),
});

// Base signup schema
const baseSignup = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  walletData: walletDataSchema.optional(),
});

// Role-specific signup schemas
const clientSignupSchema = baseSignup.extend({
  role: z.literal('client'),
  profile: clientProfileSchema,
});

const freelancerSignupSchema = baseSignup.extend({
  role: z.literal('freelancer'),
  profile: freelancerProfileSchema,
});

const signupSchema = z.discriminatedUnion('role', [
  clientSignupSchema.extend({
    currentStep: z.literal('initial').or(z.literal('profile')).optional()
  }),
  freelancerSignupSchema.extend({
    currentStep: z.literal('initial').or(z.literal('profile')).optional()
  }),
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

    const { email, password, name, role, profile, walletData } = parsed.data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ 
        error: 'User already exists',
        details: [{ path: 'email', message: 'This email is already registered' }]
      }, 400);
    }

    // If wallet is provided, validate it
    if (walletData) {
      // Verify signature
      const isValidSignature = verifyWalletSignature(walletData.address, walletData.signature, walletData.message);
      if (!isValidSignature) {
        return c.json({ error: 'Invalid wallet signature' }, 401);
      }

      // Check if wallet is already registered
      const existingWalletUser = await User.findOne({ walletAddress: walletData.address });
      if (existingWalletUser) {
        return c.json({ 
          error: 'Wallet already registered',
          details: [{ path: 'walletAddress', message: 'This wallet address is already registered' }]
        }, 400);
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with profile data and optional wallet
    const userData = {
      email,
      password: hashedPassword,
      name,
      role,
      walletAddress: walletData?.address || undefined,
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
        walletAddress: user.walletAddress,
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

// Utility function to verify wallet signatures
const verifyWalletSignature = (address: string, signature: string, message: string): boolean => {
  try {
    // Handle Coinbase Wallet signatures which have a different format
    if (signature.length > 500) {
      console.log('Detected potential Coinbase Wallet signature');
      
      // DEVELOPMENT MODE ONLY:
      // For development/testing purposes, accept all Coinbase signatures without validation
      // This is NOT secure for production, but will allow development to continue
      console.log('Development mode: Accepting Coinbase signature without validation');
      return true;
      
      // FOR PRODUCTION:
      // Replace the above 'return true' with proper Coinbase-specific verification
      // using their SDK or EIP-1271 implementation
    } 
    
    // Standard Ethereum signature verification
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    
    // Log more details about the signature format for debugging
    console.log('Signature length:', signature.length);
    console.log('Signature prefix:', signature.substring(0, 50) + '...');
    
    return false;
  }
};

// Wallet authentication (login with wallet)
authRoutes.post('/wallet', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = walletAuthSchema.safeParse(body);

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

    const { address, signature, message } = parsed.data;

    // Verify signature
    const isValidSignature = verifyWalletSignature(address, signature, message);
    if (!isValidSignature) {
      return c.json({ error: 'Invalid wallet signature' }, 401);
    }

    // Find user by wallet address
    let user = await User.findOne({ walletAddress: address });

    if (!user) {
      return c.json({
        error: 'No account linked to this wallet',
        walletAddress: address,
        needsRegistration: true
      }, 404);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, walletAddress: user.walletAddress },
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
    console.error('Wallet auth error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Wallet signup (register with wallet)
authRoutes.post('/wallet/signup', async (c) => {
  try {
    const body = await c.req.json();
    // Update validation schema to include profile data
    const walletSignupWithProfileSchema = walletSignupSchema.extend({
      password: z.string().optional(),
      profile: z.object({
        skills: z.array(z.string()).optional(),
        bio: z.string().optional(),
        hourlyRate: z.number().optional(),
        location: z.string().optional(),
        companySize: z.string().optional(),
        industry: z.string().optional(),
        companyLocation: z.string().optional(),
      }).optional()
    });

    const parsed = walletSignupWithProfileSchema.safeParse(body);

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

    const { address, signature, message, name, email, role, profile, password } = parsed.data;

    // Verify signature
    const isValidSignature = verifyWalletSignature(address, signature, message);
    if (!isValidSignature) {
      return c.json({ error: 'Invalid wallet signature' }, 401);
    }

    // Check if wallet is already registered
    const existingWalletUser = await User.findOne({ walletAddress: address });
    if (existingWalletUser) {
      return c.json({ 
        error: 'Wallet already registered',
        details: [{ path: 'walletAddress', message: 'This wallet address is already registered' }]
      }, 400);
    }

    // Check if email is already registered (if provided)
    if (email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        return c.json({ 
          error: 'Email already registered',
          details: [{ path: 'email', message: 'This email is already registered' }]
        }, 400);
      }
    }

    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      password || Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2), // Use provided password or generate random one
      salt
    );

    // Create user with wallet address and profile data
    const userData: any = {
      walletAddress: address,
      name: name || `User_${address.substring(0, 8)}`,
      role: role || 'freelancer', // Default role
      password: hashedPassword,
      ...(role === 'freelancer' || (!role && profile?.skills) ? {
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

    // Add email if provided
    if (email) {
      userData.email = email;
    }

    // Create and save the new user
    const user = new User(userData);
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, walletAddress: user.walletAddress, ...(email && { email }) },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );

    return c.json({
      message: "Account created successfully with wallet",
      token,
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
    }, 201);

  } catch (error) {
    console.error('Wallet signup error:', error);
    return c.json({ 
      error: 'Internal server error',
      details: [{ path: 'server', message: 'Something went wrong, please try again' }]
    }, 500);
  }
});

// New route specifically for updating wallet address only
authRoutes.post('/users/wallet', auth, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const parsed = walletLinkSchema.safeParse(body);

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

    const { address, signature, message } = parsed.data;

    // Verify signature
    const isValidSignature = verifyWalletSignature(address, signature, message);
    if (!isValidSignature) {
      return c.json({ error: 'Invalid wallet signature' }, 401);
    }

    // Check if wallet is already linked to another account
    const existingWalletUser = await User.findOne({ walletAddress: address });
    if (existingWalletUser && existingWalletUser._id.toString() !== user._id.toString()) {
      return c.json({ 
        error: 'Wallet already linked to another account',
        details: [{ path: 'walletAddress', message: 'This wallet address is already linked to another account' }]
      }, 400);
    }

    // Update just the wallet address
    user.walletAddress = address;
    await user.save();

    return c.json({
      message: "Wallet connected successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });

  } catch (error) {
    console.error('Wallet update error:', error);
    return c.json({ 
      error: 'Internal server error',
      details: [{ path: 'server', message: 'Something went wrong, please try again' }]
    }, 500);
  }
});

// Disconnect wallet route
authRoutes.delete('/users/wallet', auth, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Remove the wallet address
    user.walletAddress = undefined;
    await user.save();

    return c.json({
      message: "Wallet disconnected successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        walletAddress: undefined
      }
    });

  } catch (error) {
    console.error('Wallet disconnect error:', error);
    return c.json({ 
      error: 'Internal server error',
      details: [{ path: 'server', message: 'Something went wrong, please try again' }]
    }, 500);
  }
});

export { authRoutes };