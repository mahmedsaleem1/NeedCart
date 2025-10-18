import mongoose, {Schema} from 'mongoose';

const orderSchema = new Schema({
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'buyers',
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'sellers',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: 'transactions',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'products',
    default: null
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'posts',
    default: null
  },
  rentId: {
    type: Schema.Types.ObjectId,
    ref: 'rents',
    default: null
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

orderSchema.pre('validate', function (next) {
  if (!this.productId && !this.postId && !this.rentId) {
    next(new Error('Order must have either productId, postId or rentId.'));
  } else {
    next();
  }
});

export const Order = mongoose.model('Order', orderSchema);