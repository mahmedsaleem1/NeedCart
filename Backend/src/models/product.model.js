import mongoose, {Schema} from 'mongoose';

const productSchema = new Schema({
    sellerId:{
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Beauty', 'Sports', 'Toys', 'Other'],
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    availabilityStatus:{
        type: Boolean,
        default: true,
    }
}, {
  timestamps : true,
});

export const Product = mongoose.model('Product', productSchema);