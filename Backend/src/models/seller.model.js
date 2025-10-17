import mongoose, {Schema} from 'mongoose';

const sellerSchema = new Schema({
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
  is_verified : {
    type : Boolean,
    default : false,
  }
}, {
  timestamps : true,
});

export const Seller = mongoose.model('Seller', sellerSchema);