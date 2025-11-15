import { Router } from 'express';
import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js';
import {
  getBuyerDashboardStats,
  getBuyerOrders,
  getBuyerOrderDetails,
  getBuyerPosts,
  updatePostStatus,
  deletePost,
  getPostWithOffers
} from '../controllers/buyer-dashboard.controller.js';

const router = Router();

// All routes require authentication
router.use(verifyFirebaseToken);

// Dashboard stats
router.get('/stats', getBuyerDashboardStats);

// Orders
router.get('/orders', getBuyerOrders);
router.get('/orders/:orderId', getBuyerOrderDetails);

// Posts
router.get('/posts', getBuyerPosts);
router.get('/posts/:postId/offers', getPostWithOffers);
router.patch('/posts/:postId/status', updatePostStatus);
router.delete('/posts/:postId', deletePost);

export default router;
