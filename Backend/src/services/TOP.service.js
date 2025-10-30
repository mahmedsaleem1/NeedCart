import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { createCheckoutSession_INTERNAL } from '../controllers/payment.controller.js';
import { createTransaction_INTERNAL, updateTransactionStatus_INTERNAL } from '../controllers/transaction.controller.js';
import { createOrder_INTERNAL, updateOrderStatus_INTERNAL } from '../controllers/order.controller.js';

export const performTOP = async (req, res) => { 
    // TOP Update: Transaction -> Order -> Payment -> Update
    try {
        // T - Transaction Creation
        const uid = req.user.uid;
        const itemId = req.params.itemId; // Product or Offer ID
        const totalPrice = req.body.totalPrice;
        
        
        const transaction = await createTransaction_INTERNAL(uid, itemId, totalPrice);

        if (!transaction) {
            throw new apiError(500, 'Transaction creation failed during TOP update.');
        }        

        // O - Order Creation
        const transactionId = transaction.message._id;
        
        const address = req.body.address;
        const quantity = req.body.quantity;

        const order = await createOrder_INTERNAL(uid, transactionId, address, quantity ?? 1);

        if (!order) {
            throw new apiError(500, 'Order creation failed during TOP update.');
        }
        // P - Payment Processing
        // PAYMENT
        const payment = await createCheckoutSession_INTERNAL(uid, order.data.order._id);
        console.log(payment);

        return res.status(200).json(new apiResponse(200, { payment }, 'Checkout Session Created Successfully.'));

    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
};

export const updateTOPStatus = asyncHandler(async (req, res) => {
    try {
        const paymentStatus = req.query.status; // "paid", "unpaid", etc.
        const orderId = req.params.orderId;

        // U- Update of transaction status based on payment result
        if (paymentStatus === 'paid') {
            await updateTransactionStatus_INTERNAL(orderId, 'paid');
            await updateOrderStatus_INTERNAL(orderId, 'confirmed')
        }
        else {
            await updateTransactionStatus_INTERNAL(orderId, 'failed');
            await updateOrderStatus_INTERNAL(orderId, 'cancelled')
        }
        res.status(200).json(new apiResponse(200, {}, 'Transaction status updated successfully based on payment result.'));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});