import mongoose, {Schema} from 'mongoose';

const adminSchema = new Schema({
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

export const Admin = mongoose.model('Admin', adminSchema);