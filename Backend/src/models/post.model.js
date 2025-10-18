import mongoose, {Schema} from 'mongoose';

const postSchema = new Schema({
    buyerId: { 
        type: Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, {
  timestamps : true,
});

export const Post = mongoose.model('Post', postSchema);