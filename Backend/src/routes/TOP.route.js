import { Router } from 'express';
import { verifyFirebaseToken } from '../middlewares/verifyIdToken.middleware.js';
import {
  performTOP,
  handlePaymentSuccess,
  handlePaymentCancel,
  updateTOPStatus
} from '../controllers/TOP.controller.js';

const router = Router();

// Buy route (initiates the transaction)
router.post('/buy/:itemId', verifyFirebaseToken, performTOP);

// Stripe redirect routes
router.get('/success', handlePaymentSuccess);
router.get('/cancel', handlePaymentCancel);

// Update order/payment status
router.get('/update-status/:orderId', updateTOPStatus);

export default router;
