import mongoose, {Schema} from 'mongoose';

const escrowPayoutSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  escrowStatus: {
    type: String,
    enum: ['held', 'released'], // 'held' = funds with admin, 'released' = sent to seller
    default: 'held'
  },
  releasedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export const EscrowPayout = mongoose.model('EscrowPayout', escrowPayoutSchema);
