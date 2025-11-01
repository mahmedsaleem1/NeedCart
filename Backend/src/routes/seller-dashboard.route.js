import { Router } from 'express';
import {
    getHeldPaymentOrders,   
    getReleasedPaymentOrders,
    getTotalHeldAmount,
    getTotalReleasedAmount,
    updateOrderStatusToDelivered,
    providePaymentDetails
} from '../controllers/seller-dashboard.controller.js'

import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/get-held-payment-orders').get(verifyFirebaseToken, getHeldPaymentOrders);
router.route('/get-released-payment-orders').get(verifyFirebaseToken, getReleasedPaymentOrders);
router.route('/get-total-held-amount').get(verifyFirebaseToken, getTotalHeldAmount);
router.route('/get-total-released-amount').get(verifyFirebaseToken, getTotalReleasedAmount);
router.route('/update-order-status/:orderId').post(verifyFirebaseToken, updateOrderStatusToDelivered);
router.route('/provide-payment-details').post(verifyFirebaseToken, providePaymentDetails);

export default router;