import mongoose, {Schema} from 'mongoose';

const wishllistSchema = new Schema({
    buyerId : {
        type : Schema.Types.ObjectId,
        ref : 'Buyer',
        required : true,
    },
    productId : {
        type : Schema.Types.ObjectId,
        ref : 'Product',
        required : true,
    }
}, {
  timestamps : true,
});

// Create a compound unique index to prevent duplicate wishlist entries
wishllistSchema.index({ buyerId: 1, productId: 1 }, { unique: true });

export const Wishlist = mongoose.model('Wishlist', wishllistSchema);