import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Seller, Comment, Post } from '../models/index.js';

export const addCommentOnAPost = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;
    const uid = req.user.uid;

    if (!content || content.trim() === '') {
      throw new apiError(400, 'Comment content cannot be empty');
    }

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw new apiError(404, 'Post not found');
    }

    // Identify whether the logged-in user is a Buyer or Seller
    const buyer = await Buyer.findOne({ firebaseUID: uid });
    const seller = await Seller.findOne({ firebaseUID: uid });

    if (!buyer && !seller) {
      throw new apiError(400, 'You must be logged in as Buyer or Seller to comment');
    }

    // Create the comment
    const comment = await Comment.create({
      postId: post._id,
      content: content.trim(),
      buyerId: buyer?._id,
      sellerId: seller?._id,
    });

    return res
      .status(201)
      .json(new apiResponse(201, 'Comment added successfully', comment));
  } catch (error) {
    throw new apiError(error.statusCode, error.message);
  }
});

export const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.body;
    const uid = req.user.uid;

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new apiError(404, 'Comment not found');
    }

    // Identify logged-in user
    const buyer = await Buyer.findOne({ firebaseUID: uid });
    const seller = await Seller.findOne({ firebaseUID: uid });

    if (!buyer && !seller) {
      throw new apiError(400, 'You must be logged in as Buyer or Seller to delete a comment');
    }

    // Check ownership before deletion
    const isOwner =
      (buyer && comment.buyerId?.toString() === buyer._id.toString()) ||
      (seller && comment.sellerId?.toString() === seller._id.toString());

    if (!isOwner) {
      throw new apiError(403, 'You are not authorized to delete this comment');
    }

    await comment.deleteOne();

    return res
      .status(200)
      .json(new apiResponse(200, 'Comment deleted successfully'));
  } catch (error) {
    throw new apiError(error.statusCode, error.message);
  }
});

export const getAllCommentsForPost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw new apiError(404, 'Post not found');
    }

    // Get all comments for that post (including who posted them)
    const comments = await Comment.find({ postId: post._id })
      .populate('buyerId', 'email')
      .populate('sellerId', 'email')
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new apiResponse(200, 'Comments retrieved successfully', comments));
  } catch (error) {
    throw new apiError(error.statusCode, error.message);
  }
});
