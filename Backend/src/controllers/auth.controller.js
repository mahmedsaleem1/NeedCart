import { admin } from '../config/firebase.js';
import {asyncHandler} from '../utills/asyncHandler.js';
import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { sendEmail } from '../utills/nodemailer.js';


export const registerWithEmail = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new apiError(400, "Email and password are required");
  }
  try {
    const user = await admin.auth().createUser({ email, password });
    return res
      .status(201)
      .json(new apiResponse("User registered successfully", { user}));
  } catch (error) {
    throw new apiError(error.statusCode, error);
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
    return res.status(200).json(new apiResponse(200, { link }, "Password reset email sent"));
    
  } catch (error) {
    throw new apiError(error.code, error.message);
  }
});

export const loginWithIdToken = asyncHandler(async (req, res) => {
  try {
    const uid = req.user.uid;
  
    const user = await admin.auth().getUser(uid); // get full info
  
    return res.status(200).json(new apiResponse("Login successful", { user }));
  } catch (error) {
    throw new apiError(error.code, error.message);
  }
});

export const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new apiError(400, "Email is required");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    return res.status(200).json(new apiResponse("User fetched successfully", { user }));
  } catch (error) {
    throw new apiError(error.code || 500, error.message);
  }
});

export const googleLogin = asyncHandler(async (req, res) => {
  try {
    const uid = req.user.uid;
  
    const user = await admin.auth().getUser(uid);
  
    return res.status(200).json(new apiResponse("Google login successful", { user }));
  } catch (error) {
    throw new apiError(error.code , error.message);
  }
});