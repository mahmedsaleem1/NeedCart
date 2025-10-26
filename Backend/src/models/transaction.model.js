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
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  rentId: {
    type: Schema.Types.ObjectId,
    ref: 'Rent',
    default: null
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['stripe','cod'],
    default: 'stripe',
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

transactionSchema.pre('validate', function (next) {
  if (!this.productId && !this.postId && !this.rentId) {
    next(new Error('Transaction must have either productId, postId or rentId.'));
  } else {
    next();
  }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);