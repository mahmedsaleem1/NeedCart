// Buyer can create post
// Seller and other buyers can view all posts
// Post can have like, comment and send an Offer function
// Post can have title, description, price, images
// Offer is sent by seller
// Offer can be accepted or rejected by the buyer

import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Seller, Like, Comment, Post, Offer } from '../models/index.js';
import { uploadImage } from '../utills/cloudinary.utill.js';
import fs from 'fs';

export const createPost = asyncHandler(async (req, res) => {
  const { title, description, budget } = req.body;
  const uid = req.user.uid;
  
  const buyer = await Buyer.findOne({ firebaseUID: uid });

  if (!title || !description || !budget || !req.file) {
    throw new apiError(400, 'All fields are required');
  }

  try {
    // Upload image using your utility
    const imageUrl = await uploadImage(req.file.path);

    // Clean up local temp file
    fs.unlinkSync(req.file.path);

    // Create post
    const newPost = await Post.create({
      buyerId: buyer._id,
      title,
      description,
      budget,
      image: imageUrl,
    });

    return res
      .status(200)
      .json(new apiResponse('Post created successfully', { newPost }));
  } catch (error) {
    throw new apiError(error.statusCode, error.message );
  }
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // optional pagination

  try {
    // Fetch posts with pagination and populate buyer info
    const posts = await Post.find()
      .populate('buyerId', 'email') // only show necessary buyer fields
      .select('-__v') // exclude version key
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Count total posts for pagination meta
    const totalPosts = await Post.countDocuments();

    return res.status(200).json(
      new apiResponse('Posts fetched successfully', {
        total: totalPosts,
        page: parseInt(page),
        limit: parseInt(limit),
        posts,
      })
    );
  } catch (error) {
    throw new apiError(error.statusCode, error.message);
  }
});