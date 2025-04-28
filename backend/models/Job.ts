import { Schema, model } from 'mongoose';

const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  skills: [{
    type: String,
    required: true
  }],
  duration: {
    type: String,
    required: true
  },
  complexity: {
    type: String,
    enum: ['Basic', 'Medium', 'Complex'],
    required: true
  },
  attachments: [{
    type: String
  }],
  bids: [{
    type: Schema.Types.ObjectId,
    ref: 'Bid'
  }],
  hiredFreelancer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export const Job = model('Job', JobSchema);