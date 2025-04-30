import { Schema, model } from 'mongoose';

const PaymentSchema = new Schema({
  contractId: {
    type: Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  milestoneId: {
    type: Schema.Types.Mixed, // Can be ObjectId or String for contract milestone ID
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['USDC', 'USDT'], // Removed ETH, keeping only stablecoins
    required: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'escrow', 'completed', 'refunded', 'failed'],
    default: 'pending'
  },
  txHash: {
    type: String
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Payment = model('Payment', PaymentSchema);