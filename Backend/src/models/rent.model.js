import mongoose, {Schema} from 'mongoose';

const rentSchema = new Schema({
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    item_name: {
        type: String,
        required: true,
    },
    item_description: {
        type: String,
        required: true,
    },
    rental_price:{
        type: Number,
        required: true,
    },
    rental_duration: {
        type: String,
        required: true
    },
    deposit_amount: {
        type: Number,
        required: true
    },
    availability_status: {
        type: Boolean,
        default: true
    }
}, {
  timestamps : true,
});

export const Rent = mongoose.model('Rent', rentSchema);