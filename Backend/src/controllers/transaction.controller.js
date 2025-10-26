import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Seller, Post, Offer, Transaction, Product } from '../models/index.js';

export const createTransaction = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        
        const buyer = await Buyer.findOne({ firebaseUID: uid });
        
        if (!buyer) {
            throw new apiError(404, 'You must be logged in as a buyer to create a transaction.');
        }

        const itemId = req.params.itemId;
        console.log(itemId);
        
        const product = await Product.findById(itemId) || null;
        console.log("product",product);
        
        const offer = await Offer.findById(itemId) || null;
        console.log("offer",offer);
        if (!product && !offer) {
            throw new apiError(404, 'Product or Offer not found for the given ID.');
        }
    
        const totalPrice = Number(req.body.totalPrice);
        
        if (!totalPrice || totalPrice < 0) {
            throw new apiError(400, 'Total price is required and must be non-negative.');
        }

        if (totalPrice !== offer ? offer.amount : prodcut ? product.price : 0) {
            throw new apiError(400, 'Total price does not match the product price or offer amount.');
        }
    
        const transaction = await Transaction.create({
            buyerId: buyer._id,
            sellerId: product ? product.sellerId : offer ? offer.senderId : null,
            productId: product ? product._id : null,
            offerId: offer ? offer._id : null,
            totalPrice,
            paymentStatus: 'paid',
            paymentMethod: "stripe",
        });

        if (transaction) {
            res.status(201).json(new apiResponse(true, 'Transaction created successfully.', transaction));
        }
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const getTransactionById = asyncHandler(async (req, res) => {
    try {
        const transactionId = req.params.Tid;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            throw new apiError(404, 'Transaction not found.');
        }
        res.status(200).json(new apiResponse(true, 'Transaction retrieved successfully.', transaction));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);  
    }
});

export const getTransactionsByBuyer = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        const buyer = await Buyer.findOne({ firebaseUID: uid });
        if (!buyer) {
            throw new apiError(404, 'You must be logged in as a buyer to view transactions.');
        }
        const transactions = await Transaction.find({ buyerId: buyer._id });
        res.status(200).json(new apiResponse(true, 'Transactions retrieved successfully.', transactions));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);  
    }
});

export const getTransactionsBySeller = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        const seller = await Seller.findOne({ firebaseUID: uid });
        if (!seller) {
            throw new apiError(404, 'You must be logged in as a seller to view transactions.');
        }
        const transactions = await Transaction.find({ sellerId: seller._id });
        res.status(200).json(new apiResponse(true, 'Transactions retrieved successfully.', transactions));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);  
    }
});

export const updateTransactionStatus = asyncHandler(async (req, res) => {
    try {
        const transactionId = req.params.Tid;
        const { paymentStatus } = req.body;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            throw new apiError(404, 'Transaction not found.');
        }
        transaction.paymentStatus = paymentStatus;
        await transaction.save();
        res.status(200).json(new apiResponse(true, 'Transaction updated successfully.', transaction));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);  
    }
});

