import { Router } from 'express';
import {
    getAllOrderPaymentStatus,
    releasePayment,
} from '../controllers/admin.controller.js'

import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js'

const router = Router();

router.route('/get-order-payment-status').get(verifyFirebaseToken, getAllOrderPaymentStatus);
router.route('/release-payment/:escrowId').post(verifyFirebaseToken, releasePayment);

export default router;