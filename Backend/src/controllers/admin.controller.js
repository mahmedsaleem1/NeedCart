import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Seller, Order, EscrowPayout, Admin } from '../models/index.js';

export const createEscrowPayout_INTERNAL = async (order) => {
    try {
        if (!order) {
            throw new Error('Order is required to create an escrow payout.');
        }
    
        const PLATFORM_PERCENTAGE = 0.10; // 10% platform fee
        const STRIPE_TRANSACTION_FEE = 0.029; // 2.9% Stripe + $0.30 typical
        const STRIPE_FIXED_FEE = 0.30;

        const totalPrice = order.totalPrice;

        const platformFee = (totalPrice * PLATFORM_PERCENTAGE) + (totalPrice * STRIPE_TRANSACTION_FEE) + STRIPE_FIXED_FEE;

        const escrowPayment = await EscrowPayout.create({
            orderId: order._id,
            totalAmount: order.totalPrice,
            platformFee,
            netAmount: order.totalPrice - platformFee,
        })
    
        if (!escrowPayment) {
            throw new Error('Failed to create escrow payout.');
        }
        return (new apiResponse(201, { escrowPayment }, 'Escrow payout created successfully'));
    } catch (error) {
        throw new apiError(error.statusCode, `Escrow Payout Creation Error: ${error.message}`);
    }

};

export const getAllOrderPaymentStatus = asyncHandler(async (req, res) => {
    try {
        const orders = await EscrowPayout.find().populate('orderId');
        res.status(200).json(new apiResponse('Fetched all order payment statuses successfully', orders));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const releasePayment = asyncHandler(async (req, res) => {
    try {
        const {escrowId} = req.params;
        const escrowPayment = await EscrowPayout.findById(escrowId);

        const order = await Order.findById(escrowPayment.orderId);
        if (!order) {
            throw new apiError(404, 'Order associated with this escrow not found');
        }

        const seller = await Seller.findById(order.sellerId);
        if (!seller) {
            throw new apiError(404, 'Seller associated with this order not found');
        }
        if (!seller.is_verified || !seller.bankName || !seller.accountNumber) {
            throw new apiError(400, 'Seller must have verified account and payment details');
        }

        if (!escrowPayment) {
            throw new apiError(404, 'Escrow payment not found');
        }

        const escrow = await EscrowPayout.findByIdAndUpdate(escrowId, { escrowStatus: 'released' });

        res.status(200).json(new apiResponse(200, escrow,'Payment released successfully'));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const acceptToBeSellerRequest = asyncHandler(async (req, res) => {
    try {
        const { sellerId } = req.params;

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            throw new apiError(404, 'Seller not found');
        }

        const {choice}  = req.body;
        if (choice == 'reject') {
            seller.is_verified = false;
            await seller.save();
        }
        else {
            seller.is_verified = true;
            await seller.save();
        }

        res.status(200).json(new apiResponse(200, seller, 'Seller request dealt accordingly'));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});
