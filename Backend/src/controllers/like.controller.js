import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Like, Post } from '../models/index.js';

export const likePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.body;
        const uid = req.user.uid;

        const buyer = await Buyer.findOne({ firebaseUID: uid });

        const post = await Post.findById(postId);

        if (!buyer) {
            throw new apiError(400, 'You must be logged in to like a post');
        }

        if (!post) {
            throw new apiError(404, 'Post not found');
        }

        const likedPost = await Like.create({ buyerId: buyer._id, postId: post._id });

        if (likedPost) {
            return res
                .status(201)
                .json(new apiResponse(201, 'Post liked successfully', likedPost));
        }
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const unlikePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.body;
        const uid = req.user.uid;

        const buyer = await Buyer.findOne({ firebaseUID: uid });

        const post = await Post.findById(postId);

        if (!buyer) {
            throw new apiError(400, 'You must be logged in to unlike a post');
        }

        if (!post) {
            throw new apiError(404, 'Post not found');
        }

        const unlikedPost = await Like.findOneAndDelete({ buyerId: buyer._id, postId: post._id });

        if (unlikedPost) {
            return res
                .status(200)
                .json(new apiResponse(200, 'Post unliked successfully', unlikedPost));
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

        const likes = await Like.find({ postId: post._id }).populate('buyerId', 'email');

        return res
            .status(200)
            .json(new apiResponse(200, 'Likes retrieved successfully', likes));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});
