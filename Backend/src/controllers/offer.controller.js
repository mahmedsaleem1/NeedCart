import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Seller, Post, Offer } from '../models/index.js';

export const createOffer = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    
    const { amount } = req.body;

    const uid = req.user.uid;
    
    const sender = await Seller.findOne({ firebaseUID: uid });
    
    const post = await Post.findById(postId);

    if (!post) {
        throw new apiError(404, 'Post not found');
    }

    if (post.status === 'closed') {
        throw new apiError(400, 'Cannot create offer for closed post');
    }

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

export const acceptOffer = asyncHandler(async (req, res) => {
    const offerId = req.params.offerId;

    const offer = await Offer.findOne({
        _id: offerId,
    });
    const postId = offer.postId;
    const post = await Post.findOne({
        _id: postId,
    });

    const uid = req.user.uid;
    const buyer = await Buyer.findOne({ firebaseUID: uid  });
    const buyerId = post.buyerId;

    if (buyerId.toString() !== buyer._id.toString()) {
        throw new apiError(403, 'You are not authorized to accept this offer');
    }

    try {
        const acceptedOffer = await Offer.updateOne(
            { _id: offerId },
            { $set: { status: 'accepted' } }
        );

        await Post.updateOne(
            { _id: postId },
            { $set: { status: 'closed' } }
        );

        if (acceptedOffer) {
            return res
                .status(200)
                .json(new apiResponse(200, 'Offer accepted successfully', acceptedOffer));
        }
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }

});

export const rejectOffer = asyncHandler(async (req, res) => {
    const offerId = req.params.offerId;

    const offer = await Offer.findOne({
        _id: offerId,
    });
    const postId = offer.postId;
    const post = await Post.findOne({
        _id: postId,
    });

    const uid = req.user.uid;
    const buyer = await Buyer.findOne({ firebaseUID: uid  });
    const buyerId = post.buyerId;

    if (buyerId.toString() !== buyer._id.toString()) {
        throw new apiError(403, 'You are not authorized to reject this offer');
    }

    try {
        const rejectedOffer = await Offer.updateOne(
            { _id: offerId },
            { $set: { status: 'rejected' } }
        );
        if (rejectedOffer) {
            return res
                .status(200)
                .json(new apiResponse(200, 'Offer rejected successfully', rejectedOffer));
        }
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

