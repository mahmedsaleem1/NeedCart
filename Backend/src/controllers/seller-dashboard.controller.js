import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Seller, EscrowPayout, Order } from '../models/index.js';

export const getHeldPaymentOrders = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        const seller = await Seller.findOne({ firebaseUID: uid });
        if (!seller) {
            throw new apiError(401, 'You must be Logged in as Seller to access this route');
        }

        const orders =  await Order.find({ sellerId: seller._id, status: 'confirmed' });
        if (!orders || orders.length === 0) {
            throw new apiError(404, 'No confirmed orders found for this seller');
        }

        const heldPayments = await EscrowPayout.find(
                { orderId: { $in: orders.map(order => order._id) }, escrowStatus: 'held' }
            ).populate('orderId');
        
        res.status(200).json(new apiResponse(200, heldPayments, 'Held payment orders retrieved successfully'));

    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const getReleasedPaymentOrders = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        const seller = await Seller.findOne({ firebaseUID: uid });
        if (!seller) {
            throw new apiError(401, 'You must be Logged in as Seller to access this route');
        }

        const orders =  await Order.find({ sellerId: seller._id, status: 'delivered' });
        if (!orders || orders.length === 0) {
            throw new apiError(404, 'No delivered orders found for this seller');
        }
        console.log(orders);
        
        const releasedPayments = await EscrowPayout.find(
                { orderId: { $in: orders.map(order => order._id) }, escrowStatus: 'released' }
            ).populate('orderId');

        console.log(releasedPayments);
        
        res.status(200).json(new apiResponse(200, releasedPayments, 'Released payment orders retrieved successfully'));

    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const getTotalHeldAmount = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;

        // Find the seller
        const seller = await Seller.findOne({ firebaseUID: uid });
        if (!seller) {
            throw new apiError(401, 'You must be logged in as Seller to access this route');
        }

        // Fetch EscrowPayouts with status 'held' and populate orderId to filter by seller
        const heldPayments = await EscrowPayout.find({ escrowStatus: 'held' })
            .populate({
                path: 'orderId',
                match: { sellerId: seller._id }  // only orders of this seller
            });
            
        // Remove payouts where orderId didn't match (populate returns null)
        const filteredPayments = heldPayments.filter(p => p.orderId !== null);

        // Sum netAmount (or totalAmount, depending on what you want)
        const totalHeldAmount = filteredPayments.reduce(
            (acc, payment) => acc + payment.netAmount,
            0
        );

        res.status(200).json(new apiResponse(200, totalHeldAmount, 'Total held amount retrieved successfully'));
        
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const getTotalReleasedAmount = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        const seller = await Seller.findOne({ firebaseUID: uid });
        if (!seller) {
            throw new apiError(401, 'You must be Logged in as Seller to access this route');
        }

        const releasedPayments = await EscrowPayout.find({ escrowStatus: 'released' })
            .populate({
                path: 'orderId',       // populate the order document
                match: { sellerId: seller._id }  // filter only orders of this seller
            });

        // Remove any escrow payouts where orderId didn't match (populate returns null)
        const filteredPayments = releasedPayments.filter(p => p.orderId !== null);
        

        const totalReleasedAmount = filteredPayments.reduce(
            (acc, payment) => acc + payment.netAmount, 
            0
        );

        res.status(200).json(new apiResponse(200, totalReleasedAmount, 'Total released amount retrieved successfully'));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const updateOrderStatusToDelivered = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        const seller = await Seller.findOne({ firebaseUID: uid });
        if (!seller) {
            throw new apiError(401, 'You must be Logged in as Seller to access this route');
        }

        const { orderId } = req.params;
        const order = await Order.findOne({ _id: orderId, sellerId: seller._id });
        if (!order) {
            throw new apiError(404, 'Order not found for this seller');
        }

        order.status = 'delivered';
        order.deliveredAt = new Date();
        await order.save();

        res.status(200).json(new apiResponse(200, order, 'Order status updated to delivered successfully'));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const providePaymentDetails = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        const seller = await Seller.findOne({ firebaseUID: uid });
        if (!seller) {
            throw new apiError(401, 'You must be Logged in as Seller to access this route');
        }

        const { bankName, accountNumber } = req.body;
        if (!bankName || !accountNumber) {
            throw new apiError(400, 'Bank name and account number are required');
        }

        seller.bankName = bankName;
        seller.accountNumber = accountNumber;
        await seller.save();

        res.status(200).json(new apiResponse(200, seller, 'Payment details updated successfully'));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});