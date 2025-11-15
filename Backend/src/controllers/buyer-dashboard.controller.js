import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Order, Post, Product, Seller, Offer } from '../models/index.js';

// Get buyer dashboard stats
export const getBuyerDashboardStats = asyncHandler(async (req, res) => {
  const uid = req.user.uid;

  const buyer = await Buyer.findOne({ firebaseUID: uid });
  if (!buyer) {
    throw new apiError(404, 'Buyer not found');
  }

  // Get order counts by status
  const orders = await Order.find({ buyerId: buyer._id });
  
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
  };

  // Get posts count
  const posts = await Post.find({ buyerId: buyer._id });
  stats.totalPosts = posts.length;
  stats.openPosts = posts.filter(p => p.status === 'open').length;
  stats.closedPosts = posts.filter(p => p.status === 'closed').length;

  // Calculate total spent (delivered orders only)
  stats.totalSpent = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return res
    .status(200)
    .json(new apiResponse(200, stats, 'Buyer dashboard stats fetched successfully'));
});

// Get all buyer orders with filters
export const getBuyerOrders = asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { status } = req.query; // optional filter: pending, confirmed, delivered, cancelled

  const buyer = await Buyer.findOne({ firebaseUID: uid });
  if (!buyer) {
    throw new apiError(404, 'Buyer not found');
  }

  const query = { buyerId: buyer._id };
  if (status && ['pending', 'confirmed', 'delivered', 'cancelled'].includes(status)) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('sellerId', 'email firebaseUID')
    .populate('productId', 'name images price')
    .populate('postId', 'title description budget')
    .populate('transactionId', 'totalPrice status')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, orders, 'Buyer orders fetched successfully'));
});

// Get single order details
export const getBuyerOrderDetails = asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { orderId } = req.params;

  const buyer = await Buyer.findOne({ firebaseUID: uid });
  if (!buyer) {
    throw new apiError(404, 'Buyer not found');
  }

  const order = await Order.findOne({ _id: orderId, buyerId: buyer._id })
    .populate('sellerId', 'email firebaseUID')
    .populate('productId', 'name images price description category availableStock')
    .populate('postId', 'title description budget image')
    .populate('transactionId', 'totalPrice status createdAt');

  if (!order) {
    throw new apiError(404, 'Order not found');
  }

  return res
    .status(200)
    .json(new apiResponse(200, order, 'Order details fetched successfully'));
});

// Get all buyer posts
export const getBuyerPosts = asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { status } = req.query; // optional filter: open, closed

  const buyer = await Buyer.findOne({ firebaseUID: uid });
  if (!buyer) {
    throw new apiError(404, 'Buyer not found');
  }

  const query = { buyerId: buyer._id };
  if (status && ['open', 'closed'].includes(status)) {
    query.status = status;
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, posts, 'Buyer posts fetched successfully'));
});

// Update post status (open/closed)
export const updatePostStatus = asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { postId } = req.params;
  const { status } = req.body;

  if (!status || !['open', 'closed'].includes(status)) {
    throw new apiError(400, 'Valid status is required (open or closed)');
  }

  const buyer = await Buyer.findOne({ firebaseUID: uid });
  if (!buyer) {
    throw new apiError(404, 'Buyer not found');
  }

  const post = await Post.findOne({ _id: postId, buyerId: buyer._id });
  if (!post) {
    throw new apiError(404, 'Post not found or you do not have permission to update it');
  }

  post.status = status;
  await post.save();

  return res
    .status(200)
    .json(new apiResponse(200, post, 'Post status updated successfully'));
});

// Delete a post
export const deletePost = asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { postId } = req.params;

  const buyer = await Buyer.findOne({ firebaseUID: uid });
  if (!buyer) {
    throw new apiError(404, 'Buyer not found');
  }

  const post = await Post.findOne({ _id: postId, buyerId: buyer._id });
  if (!post) {
    throw new apiError(404, 'Post not found or you do not have permission to delete it');
  }

  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new apiResponse(200, null, 'Post deleted successfully'));
});

// Get post with offers
export const getPostWithOffers = asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { postId } = req.params;

  const buyer = await Buyer.findOne({ firebaseUID: uid });
  if (!buyer) {
    throw new apiError(404, 'Buyer not found');
  }

  const post = await Post.findOne({ _id: postId, buyerId: buyer._id });
  if (!post) {
    throw new apiError(404, 'Post not found or you do not have permission to view it');
  }

  const offers = await Offer.find({ postId: post._id })
    .populate('sellerId', 'email firebaseUID')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, { post, offers }, 'Post with offers fetched successfully'));
});
