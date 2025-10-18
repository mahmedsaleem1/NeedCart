import mongoose, {Schema} from 'mongoose';

const commentSchema = new Schema({
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
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps : true,
});

commentSchema.pre('validate', function (next) {
  if (!this.sellerId && !this.buyerId) {
    next(new Error('Comment must have either sellerId or buyerId.'));
  } else {
    next();
  }
});

export const Comment = mongoose.model('Comment', commentSchema);