import { admin } from '../config/firebase.js';
import {asyncHandler} from '../utills/asyncHandler.js';
import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { sendEmail, sendOTPEmail } from '../utills/nodemailer.js';
import { Buyer, Seller, OTP } from '../models/index.js';

export const registerWithEmail = asyncHandler(async (req, res) => {

  const { email, password } = req.body;
  var role = req.body.role
  role = role.toLowerCase().trim();
  
  if (!email || !password) {
    throw new apiError(400, "Email and password are required");
  }

  if (role !== "buyer" && role !== "seller") {
    throw new apiError(400, "Role must be either 'buyer' or 'seller'");
  }

  try {
    // Check if user already exists in Firebase
    try {
      await admin.auth().getUserByEmail(email);
      throw new apiError(400, "User with this email already exists");
    } catch (error) {
      // User doesn't exist, which is what we want
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Store OTP in database
    await OTP.create({
      email,
      otp,
      role,
      password,
    });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    return res
      .status(200)
      .json(new apiResponse(200, { email }, "OTP sent to your email. Please verify to complete registration."));
  } 
  catch (error) {
    throw new apiError(error.statusCode || 500, error.message || error);
  }
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new apiError(400, "Email and OTP are required");
  }

  try {
    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      throw new apiError(400, "Invalid or expired OTP");
    }

    // Create Firebase user
    const user = await admin.auth().createUser({ 
      email: otpRecord.email, 
      password: otpRecord.password 
    });

    const uid = user.uid;

    // Create buyer or seller record
    if (otpRecord.role === "buyer") {
      await Buyer.create({
        email: otpRecord.email,
        firebaseUID: uid
      });
    } else if (otpRecord.role === "seller") {
      await Seller.create({
        email: otpRecord.email,
        firebaseUID: uid
      });
    }

    // Delete OTP record after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    return res
      .status(201)
      .json(new apiResponse(201, user, "User registered successfully"));
  } 
  catch (error) {
    throw new apiError(error.statusCode || 500, error.message || error);
  }
});

export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  try {
    // Find existing OTP record
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      throw new apiError(400, "No pending registration found for this email");
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update OTP
    otpRecord.otp = otp;
    otpRecord.createdAt = Date.now();
    await otpRecord.save();

    // Resend OTP via email
    await sendOTPEmail(email, otp);

    return res
      .status(200)
      .json(new apiResponse(200, { email }, "OTP resent successfully"));
  } 
  catch (error) {
    throw new apiError(error.statusCode || 500, error.message || error);
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;  

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  try {
    const link = await admin.auth().generatePasswordResetLink(email);

    await sendEmail(email, "Password Reset", `Click here to reset your password: ${link}`);
    return res.status(200).json(new apiResponse(200, link, "Password reset email sent"));
    
  } catch (error) {
    throw new apiError(error.code, error.message);
  }
});

export const loginWithIdToken = asyncHandler(async (req, res) => {
  try {
    const uid = req.user.uid;        

    // Get Firebase user info
    const user = await admin.auth().getUser(uid);

    // Check if the user is a Buyer
    let role = null;

    const buyer = await Buyer.findOne({ firebaseUID: uid });
    if (buyer) {
      role = "buyer";
    } else {
      const seller = await Seller.findOne({ firebaseUID: uid });
      if (seller) {
        role = "seller";
      }
    }
    if (!role) {
      role = "admin";
    }

    return res.status(200).json(
      new apiResponse(200, { user, role }, "Login successful")
    );

  } catch (error) {
    throw new apiError(error.code || 500, error.message);
  }
});

export const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new apiError(400, "Email is required");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    return res.status(200).json(new apiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    throw new apiError(error.code || 500, error.message);
  }
});

export const googleLogin = asyncHandler(async (req, res) => {
  try {
    const uid = req.user.uid;
  
    const user = await admin.auth().getUser(uid);

    return res.status(200).json(new apiResponse(200, user, "Google login successful"));
  } catch (error) {
    throw new apiError(error.code , error.message);
  }
});