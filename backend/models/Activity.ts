import { Schema, model } from 'mongoose';

const ActivitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['job-posted', 'bid-new', 'payment', 'message', 'milestone', 'job-application', 'bid-accepted', 'wallet-connected', 'wallet-transaction'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  walletAddress: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const Activity = model('Activity', ActivitySchema);