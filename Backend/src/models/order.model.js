import mongoose, {Schema} from 'mongoose';

const orderSchema = new Schema({
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
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
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
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  deliveredAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  }
}, {
  timestamps: true
});

orderSchema.pre('validate', function (next) {
  if (this.postId) this.quantity = 1;
  
  if (!this.productId && !this.postId) {
    next(new Error('Order must have either productId or postId.'));
  } else {
    next();
  }
});

export const Order = mongoose.model('Order', orderSchema);