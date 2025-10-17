import mongoose from "mongoose";
import dotenv from "dotenv";
import { asyncHandler } from "../utills/asyncHandler.js";

dotenv.config();
const DB_NAME = 'NeedKart';
const connectDB = asyncHandler(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
});

connectDB();

export default connectDB;
