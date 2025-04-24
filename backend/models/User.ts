import { Schema, model } from 'mongoose';

// User schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['client', 'freelancer'], required: true },
  createdAt: { type: Date, default: Date.now }
});

// User model
const User = model('User', userSchema);

export { User };