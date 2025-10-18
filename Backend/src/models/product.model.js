import mongoose, {Schema} from 'mongoose';

const productSchema = new Schema({
    sellerId:{
        type: Schema.Types.ObjectId,
        ref: 'sellers',
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    description:{
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