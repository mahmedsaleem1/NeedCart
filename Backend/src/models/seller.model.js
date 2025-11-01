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
  },
  bankName: {
    type: String,
    enum: ['EasyPaisa', 'JazzCash', 'Meezan Bank', 'Muslim Commercial Bank', 'Bank Alfalah', 'Faysal Bank', 'Standard Chartered', 'Allied Bank', 'Bank of Punjab', 'Askari Bank', 'Habib Bank Limited', 'National Bank of Pakistan', 'Soneri Bank', 'Silk Bank', 'Summit Bank', 'United Bank Limited', 'Zarai Taraqiati Bank'],
    default: null,
  },
  accountNumber: {
    type: Number,
    unique: true,
    default: null,
  },
}, {
  timestamps : true,
});

export const Seller = mongoose.model('Seller', sellerSchema);