import { Router } from 'express';
import {
    getOrderDetails,
    updateOrderStatus,
    getBuyerOrders,
    getSellerOrders
} from '../controllers/order.controller.js';

import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js';

const router = Router();

router.route('/details/:orderId').get(verifyFirebaseToken, getOrderDetails);
router.route('/update-status/:orderId').patch(verifyFirebaseToken, updateOrderStatus);
router.route('/buyer-orders').get(verifyFirebaseToken, getBuyerOrders);
router.route('/seller-orders').get(verifyFirebaseToken, getSellerOrders);

export default router;
