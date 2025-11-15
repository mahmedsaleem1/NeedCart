import mongoose, { Schema } from 'mongoose';

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['buyer', 'seller'],
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // OTP expires after 10 minutes (600 seconds)
  },
}, {
  timestamps: true,
});

export const OTP = mongoose.model('OTP', otpSchema);
