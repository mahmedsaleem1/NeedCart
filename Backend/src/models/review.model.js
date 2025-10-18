import mongoose, {Schema} from 'mongoose';

const reviewSchema = new Schema({
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
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: false
    }
}, {
  timestamps : true,
});

export const Review = mongoose.model('Review', reviewSchema);