import mongoose, {Schema} from 'mongoose';

const transactionSchema = new Schema({
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

transactionSchema.pre('validate', function (next) {
  if (!this.productId && !this.postId && !this.rentId) {
    next(new Error('Transaction must have either productId, postId or rentId.'));
  } else {
    next();
  }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);