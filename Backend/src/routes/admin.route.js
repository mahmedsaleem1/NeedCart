import { Router } from 'express';
import {
    getAllOrderPaymentStatus,
    releasePayment,
    acceptToBeSellerRequest,
    getDashboardOverview,
    getRevenueAnalytics,
    getAllUsers,
    getAllSellersRequests,
    getAllOrders,
    getAllProducts,
    getAllPosts,
    getTransactionHistory,
    deleteUser,
    deleteProduct,
    deletePost
} from '../controllers/admin.controller.js'

import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

// Dashboard Analytics
router.route('/dashboard-overview').get(verifyFirebaseToken, getDashboardOverview);
router.route('/revenue-analytics').get(verifyFirebaseToken, getRevenueAnalytics);

// Payment Management
router.route('/get-order-payment-status').get(verifyFirebaseToken, getAllOrderPaymentStatus);
router.route('/release-payment/:escrowId').post(verifyFirebaseToken, releasePayment);

// Seller Management
router.route('/sellers-requests').get(verifyFirebaseToken, getAllSellersRequests);
router.route('/accept-seller-request/:sellerId').post(verifyFirebaseToken, acceptToBeSellerRequest);

// User Management
router.route('/users').get(verifyFirebaseToken, getAllUsers);
router.route('/users/:role/:userId').delete(verifyFirebaseToken, deleteUser);

// Order Management
router.route('/orders').get(verifyFirebaseToken, getAllOrders);

// Product & Post Management
router.route('/products').get(verifyFirebaseToken, getAllProducts);
router.route('/products/:productId').delete(verifyFirebaseToken, deleteProduct);
router.route('/posts').get(verifyFirebaseToken, getAllPosts);
router.route('/posts/:postId').delete(verifyFirebaseToken, deletePost);

// Transaction History
router.route('/transactions').get(verifyFirebaseToken, getTransactionHistory);

export default router;