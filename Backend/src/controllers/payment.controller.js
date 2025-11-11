import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { stripe } from '../config/stripe.js';
import { Buyer, Order, Offer } from '../models/index.js';

export const createCheckoutSession_INTERNAL = async (uid, orderId) => {
  const buyer = await Buyer.findOne({ firebaseUID: uid });
  if (!buyer) throw new apiError(404, 'Buyer not found');

  const order = await Order.findById(orderId)
    .populate('productId')
    .populate('postId')
    .populate('transactionId');

  if (!order) throw new apiError(404, 'Order not found');

  let price;
  if(order.postId){
    // Find offer by postId and transaction's offerId (offer can be pending or accepted)
    const offerId = order.transactionId.offerId;
    if (!offerId) throw new apiError(400, 'No offer ID found in transaction');
    
    const offer = await Offer.findById(offerId);
    if (!offer) throw new apiError(404, 'Offer not found');
    
    price = offer.amount;
  }
  
  const item = order.productId || order.postId;
  if (!item) throw new apiError(400, 'No product or post linked to order');

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'pkr',
          product_data: {
            name: item.title || 'Item',
            description: item.description || '',
          }, 
          unit_amount: Math.round(item.price * 100) || Math.round(price * 100),
        },
        quantity: order.quantity || 1,
      },
    ],
    metadata: {
      orderId: order._id.toString(),
      buyerId: buyer._id.toString(),
      transactionId: order.transactionId._id.toString(),
      type: order.productId ? 'product' : 'post',
      postId: order.postId?._id?.toString() || '',
      productId: order.productId?._id?.toString() || '',
    },
    success_url: `${process.env.LOCAL_URL}/api/v1/item/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.LOCAL_URL}/api/v1/item/cancel?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session; // Return the raw Stripe session object
};
