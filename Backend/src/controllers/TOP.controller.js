import { stripe } from '../config/stripe.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { performTOP as performTOPService } from '../services/TOP.service.js';
import { updateTOPStatus as updateTOPStatusService } from '../services/TOP.service.js';

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
//   const itemDescription = lineItems.data[0]?.description;

  res.redirect(`/api/v1/item/update-status/${orderId}?status=${paymentStatus}`);
});

export const handlePaymentCancel = asyncHandler(async (req, res) => {
  const [session, lineItems] = await Promise.all([
    stripe.checkout.sessions.retrieve(req.query.session_id, {
      expand: ['payment_intent.payment_method']
    }),
    stripe.checkout.sessions.listLineItems(req.query.session_id)
  ]);

  const orderId = session.metadata.orderId;
  const paymentStatus = session.payment_status;
//   const itemDescription = lineItems.data[0]?.description;

  res.redirect(`/api/v1/item/update-status/${orderId}?status=${paymentStatus}`);
});

export const updateTOPStatus = asyncHandler(async (req, res) => {
  await updateTOPStatusService(req, res);
});
