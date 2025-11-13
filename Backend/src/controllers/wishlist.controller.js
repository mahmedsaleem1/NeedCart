import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Product, Wishlist} from '../models/index.js';

export const addToWishlist = asyncHandler(async (req, res) => {
    // only buyer can add
    try {
        const uid = req.user.uid;

        const buyer = await Buyer.findOne({ firebaseUID: uid });

        if (!buyer) {
            throw new apiError(404, 'You must be logged in as a buyer to add to wishlist');
        }

        const productId = req.params.prodId;
        const product = await Product.findById(productId);

        if (!product) {
            throw new apiError(404, 'Product not found');
        }

        // Check if product is already in wishlist
        const existingItem = await Wishlist.findOne({
            buyerId: buyer._id,
            productId
        });

        if (existingItem) {
            throw new apiError(400, 'Product is already in your wishlist');
        }

        const wishlistItem = await Wishlist.create({
            buyerId: buyer._id,
            productId
        });

        return res.status(201).json(new apiResponse(200, wishlistItem, 'Product added to wishlist'));

    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        const buyer = await Buyer.findOne({ firebaseUID: uid });
        if (!buyer) {
            throw new apiError(404, 'You must be logged in as a buyer to remove from wishlist');
        }

        const productId = req.params.prodId;

        // Use deleteMany to remove all duplicate entries
        const result = await Wishlist.deleteMany({
            buyerId: buyer._id,
            productId
        });

        if (!result || result.deletedCount === 0) {
            throw new apiError(404, 'Wishlist item not found');
        }
        
        return res.status(200).json(new apiResponse(200, result, `Removed ${result.deletedCount} item(s) from wishlist`));
        
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const wishlistOfLoggedInBuyer = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        const buyer = await Buyer.findOne({ firebaseUID: uid });
        if (!buyer) {
            throw new apiError(402, "You must be Logged in as a Buyer to See Wishlist")
        }

        const wishlist = await Wishlist.find({buyerId: buyer._id}).populate('productId');
        if(!wishlist) {
            throw new apiError(401, "Your Wishlist is Empty")
        }

        return res.status(200)
                    .json(new apiResponse(200, wishlist, "Wishlist fetched successfully"));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});