import { Schema, model } from 'mongoose';

// Define interfaces for better type safety
interface IUser {
  email: string;
  password: string;
  name: string;
  role: 'client' | 'freelancer';
  createdAt: Date;
  updatedAt: Date;
  // Freelancer specific fields
  skills?: string[];
  bio?: string;
  hourlyRate?: number;
  location?: string;
  // Client specific fields
  companySize?: string;
  industry?: string;
  companyLocation?: string;
}

// User schema
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['client', 'freelancer'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Freelancer specific fields
  skills: { type: [String], required: false },
  bio: { type: String, required: false },
  hourlyRate: { type: Number, required: false },
  location: { type: String, required: false },
  // Client specific fields
  companySize: { type: String, required: false },
  industry: { type: String, required: false },
  companyLocation: { type: String, required: false }
});

// User model
const User = model<IUser>('User', userSchema);

export { User, IUser };