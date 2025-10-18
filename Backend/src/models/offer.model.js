import mongoose, {Schema} from 'mongoose';

const offerSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
}, {
  timestamps : true,
});

export const Offer = mongoose.model('Offer', offerSchema);