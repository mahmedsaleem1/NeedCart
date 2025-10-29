import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { createTransactionCOD_INTERNAL } from '../controllers/transaction.controller.js';
import { createOrderCOD_INTERNAL } from '../controllers/order.controller.js';

// Create a Transaction with paymentMethod as 'COD' and paymentStatus as 'pending'
// Create an order with paymentStatus as 'confirmed'
// The paymentStatus of Transaction will be 'paid' when order status is 'delivered'
// The order status flow will be: confirmed -> delivered

export const performCOD = asyncHandler(async (req, res) => { 
    try {
        // T - Transaction Creation
        const uid = req.user.uid;
        const itemId = req.params.itemId; // Product or Offer ID
        const totalPrice = req.body.totalPrice;
        
        
        const transaction = await createTransactionCOD_INTERNAL(uid, itemId, totalPrice);

        if (!transaction) {
            throw new apiError(500, 'Transaction creation failed during COD.');
        }        

        // O - Order Creation
        const transactionId = transaction.message._id;
        
        const address = req.body.address;
        const quantity = req.body.quantity;

        const order = await createOrderCOD_INTERNAL(uid, transactionId, address, quantity ?? 1);

        if (!order) {
            throw new apiError(500, 'Order creation failed during COD.');
        }

        return res.status(200).json(new apiResponse(200, { transaction, order }, 'COD Order Placed Successfully.'));

    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});