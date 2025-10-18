// Offer is sent by seller
// Offer can be accepted or rejected by the buyer
// All sellers can see the offers that r sent


import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Seller, Like, Comment, Post, Offer } from '../models/index.js';

export const createOffer = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    
    const { amount } = req.body;

    const uid = req.user.uid;
    
    const sender = await Seller.findOne({ firebaseUID: uid });
    
    const post = await Post.findById(postId);

    if (!amount) {
        throw new apiError(400, 'Amount is required');
    }

    if (!sender) {
        throw new apiError(400, 'You must be logged in to make an offer');
    }

    try {
        const offer = await Offer.create({
            postId,
            senderId: sender._id,
            amount
        });
        if (offer) {
            return res
                .status(201)
                .json(new apiResponse(201, 'Offer created successfully', offer));

        }
    } catch (error) {
        throw new apiError(error.statusCode, error.message );
    }

});

export const getAllOffers = asyncHandler(async (req, res) => { 
    const postId = req.params.postId;

    try {
        const offers = await Offer.find({
            postId
        })
        .populate('senderId', 'email') // only show necessary sender fields
        .sort({ createdAt: -1 }); // sort by newest first        
        
        return res
            .status(200)
            .json(new apiResponse(200, 'Offers fetched successfully', offers));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const acceptOffer = asyncHandler(async (req, res) => {});

export const rejectOffer = asyncHandler(async (req, res) => {});

