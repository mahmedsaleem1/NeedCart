import mongoose, {Schema} from 'mongoose';

const buyerSchema = new Schema({
  email : {
    type : String,
    required : true,
    unique : true,
    trim : true,
    lowercase : true,
  },
  firebaseUID : {
    type : String,
    required : true,
    unique : true,
  },
}, {
  timestamps : true,
});

export const Buyer = mongoose.model('Buyer', buyerSchema);