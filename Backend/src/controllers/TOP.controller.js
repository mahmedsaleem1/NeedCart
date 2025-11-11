import { stripe } from '../config/stripe.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { performTOP as performTOPService } from '../services/TOP.service.js';
import { updateTOPStatus as updateTOPStatusService } from '../services/TOP.service.js';
import { updateTransactionStatus_INTERNAL } from './transaction.controller.js';
import { updateOrderStatus_INTERNAL } from './order.controller.js';
import { Order, Offer, Post } from '../models/index.js';

export const performTOP = asyncHandler(async (req, res) => {
  await performTOPService(req, res);
});

export const handlePaymentSuccess = asyncHandler(async (req, res) => {
  const [session, lineItems] = await Promise.all([
    stripe.checkout.sessions.retrieve(req.query.session_id, {
      expand: ['payment_intent.payment_method']
    }),
    stripe.checkout.sessions.listLineItems(req.query.session_id)
  ]);

  const orderId = session.metadata.orderId;
  const paymentStatus = session.payment_status;

  // Update the order and transaction status
  if (paymentStatus === 'paid') {
    await updateTransactionStatus_INTERNAL(orderId, 'paid');
    await updateOrderStatus_INTERNAL(orderId, 'confirmed');
    
    // If this is a post-based order (offer), accept the offer and close the post
    const order = await Order.findById(orderId).populate('transactionId');
    if (order && order.postId && order.transactionId && order.transactionId.offerId) {
      const offerId = order.transactionId.offerId;
      const postId = order.postId;
      
      // Accept the offer
      await Offer.updateOne({ _id: offerId }, { $set: { status: 'accepted' } });
      
      // Close the post
      await Post.updateOne({ _id: postId }, { $set: { status: 'closed' } });
    }
  } else {
    await updateTransactionStatus_INTERNAL(orderId, 'failed');
    await updateOrderStatus_INTERNAL(orderId, 'cancelled');
  }
  
  // Redirect to frontend home page
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export const handlePaymentCancel = asyncHandler(async (req, res) => {
  const [session, lineItems] = await Promise.all([
    stripe.checkout.sessions.retrieve(req.query.session_id, {
      expand: ['payment_intent.payment_method']
    }),
    stripe.checkout.sessions.listLineItems(req.query.session_id)
  ]);

  const orderId = session.metadata.orderId;

  // Update the order and transaction status as cancelled
  await updateTransactionStatus_INTERNAL(orderId, 'failed');
  await updateOrderStatus_INTERNAL(orderId, 'cancelled');
  
  // Redirect to frontend home page
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export const updateTOPStatus = asyncHandler(async (req, res) => {
  await updateTOPStatusService(req, res);
});
