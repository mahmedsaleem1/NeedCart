import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Seller, Like, Post } from '../models/index.js';

export const likePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.body;
        const uid = req.user.uid;

        // Check if user is buyer or seller
        const buyer = await Buyer.findOne({ firebaseUID: uid });
        const seller = await Seller.findOne({ firebaseUID: uid });

        if (!buyer && !seller) {
            throw new apiError(400, 'You must be logged in as Buyer or Seller to like a post');
        }

        const post = await Post.findById(postId);

        if (!post) {
            throw new apiError(404, 'Post not found');
        }

        // Check if already liked by this user
        const existingLike = await Like.findOne({ 
            postId: post._id,
            $or: [
                { buyerId: buyer?._id },
                { sellerId: seller?._id }
            ]
        });

        if (existingLike) {
            throw new apiError(400, 'You have already liked this post');
        }

        // Create like with appropriate user ID
        const likeData = {
            postId: post._id,
            buyerId: buyer?._id,
            sellerId: seller?._id
        };

        const likedPost = await Like.create(likeData);

        if (likedPost) {
            return res
                .status(201)
                .json(new apiResponse(201, likedPost, 'Post liked successfully'));
        }
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const unlikePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.body;
        const uid = req.user.uid;

        // Check if user is buyer or seller
        const buyer = await Buyer.findOne({ firebaseUID: uid });
        const seller = await Seller.findOne({ firebaseUID: uid });

        if (!buyer && !seller) {
            throw new apiError(400, 'You must be logged in as Buyer or Seller to unlike a post');
        }

        const post = await Post.findById(postId);

        if (!post) {
            throw new apiError(404, 'Post not found');
        }

        // Find and delete like by this user
        const unlikedPost = await Like.findOneAndDelete({ 
            postId: post._id,
            $or: [
                { buyerId: buyer?._id },
                { sellerId: seller?._id }
            ]
        });

        if (unlikedPost) {
            return res
                .status(200)
                .json(new apiResponse(200, unlikedPost, 'Post unliked successfully'));
        } else {
            throw new apiError(400, 'You have not liked this post');
        }
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const getLikesForPost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            throw new apiError(404, 'Post not found');
        }

        const likes = await Like.find({ postId: post._id })
            .populate('buyerId', 'email')
            .populate('sellerId', 'email');

        return res
            .status(200)
            .json(new apiResponse(200, likes, 'Likes retrieved successfully'));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});
