import mongoose, {Schema} from 'mongoose';

const likeSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'posts',
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'sellers',
    default: null
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'buyers',
    default: null
  }
}, {
  timestamps : true,
});

likeSchema.pre('validate', function (next) {
  if (!this.sellerId && !this.buyerId) {
    next(new Error('Like must have either sellerId or buyerId.'));
  } else {
    next();
  }
});

export const Like = mongoose.model('Like', likeSchema);