import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Product, Seller, Review, Order, Transaction } from '../models/index.js';

// Buyer can create review for a product purchased

export const createReview = asyncHandler(async (req, res) => {
    // user must be logged in as a buyer
    // product must be 'delived' to the buyer (order)
    try {        
        const uid = req.user.uid;
        const productId = req.params.prodId;
        const {rating, comment} = req.body

        if (!rating || !comment) {
            throw new apiError(405, "All Fields are required")
        }

        const buyer = await Buyer.findOne({firebaseUID: uid})

        if(!buyer) {
            throw new apiError(401, "You must be Logged in as a Buyer to continue")
        }
        
        const product = await Product.findById(productId)

        if (!product) {
            throw new apiError(404, "Product not found")
        }

        const transaction = await Transaction.findOne({
            buyerId: buyer._id,
            productId: product._id
        })

        if (!transaction) {
            throw new apiError(401, "You have not purchased this product")
        }

        const order = await Order.findOne({
            buyerId: buyer._id,
            productId: product._id,
            transactionId: transaction._id
        })

        if (!order) {
            throw new apiError(404, "Order not found for this product")
        }

        if(order.status !== 'delivered') {
            throw new apiError(401, "You can only review a product that has been delivered")
        }

        const review = await Review.create({
            buyerId: buyer._id,
            productId: product._id,
            rating, 
            comment
        })

        return res.status(201).json(new apiResponse(201, review, "Review added Successfully"))


    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const deleteReview = asyncHandler(async (req, res) => {
    // logged in user must be the author of review
    try {
        const revId = req.params.revId

        const uid = req.user.uid
        const buyer = await Buyer.findOne({firebaseUID: uid})

        if(!buyer) {
            throw new apiError(401, "You must be Logged in as a Buyer to continue")
        }

        const review = await Review.findById(revId)

        if (!review) {
            throw new apiError(404, "Review not found")
        }

        if (buyer._id.toString() != review.buyerId.toString()){
            throw new apiError(401, "You must be the author of the review inorder to delete")
        }

        const deletedReview = await Review.findByIdAndDelete(review._id)

        return res.status(200).json(new apiResponse(200, deletedReview, "Review deleted Successfully"))

    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const getReviewsForProduct = asyncHandler(async (req, res) => {
    try {
        const prodId = req.params.prodId

        const product = await Product.findById(prodId)

        if (!product)
            throw new apiError(404, "The product you are looking for does not exists")

        const reviews = await Review.find({productId: product._id}).populate('productId')

        if (!reviews || reviews.length === 0)
            throw new apiError(404, "This product have no reviews")

        return res.status(200).json(new apiResponse(200, reviews, "Reviews fetched Successfully"))


    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

