import mongoose, {Schema} from 'mongoose';

const transactionSchema = new Schema({
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  offerId: {
    type: Schema.Types.ObjectId,
    ref: 'Offer',
    default: null
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['stripe','cod']
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

transactionSchema.pre('validate', function (next) {
  if (!this.productId && !this.offerId) {
    next(new Error('Transaction must have either productId or offerId.'));
  } else {
    next();
  }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);