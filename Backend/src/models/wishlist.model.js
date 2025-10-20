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

export const Wishlist = mongoose.model('Wishlist', wishllistSchema);