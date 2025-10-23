// Product can be uploaded and deleted by seller
// Product can be added to cart than bought(order placed) by buyer
// product can be added or removed to wishlist by buyer
// product can be reviewed by buyer

import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Product, Seller} from '../models/index.js';
import { uploadImage } from '../utills/cloudinary.utill.js';
import fs from 'fs';

export const addProduct = asyncHandler(async (req, res) => {
// title, description, image, category, price, available Stock (Not available if zero)
    try {
        const uid = req.user.uid
        const { title, description, category, price, availableStock } = req.body;
    
        if (!title || !description || !category || !price || !availableStock) {
            throw new apiError(403, 'All fields are required'); // use throw + new
        }

        if (availableStock === 0) {
            throw new apiError(401, 'All fields are required'); // use throw + new
        }

        const seller = await Seller.findOne({firebaseUID: uid})

        if (!seller) {
            throw new apiError(404, 'You must be logged in as a seller to add a product');
        }

        if (!seller.is_verified) {
            throw new apiError(403, 'Your seller account is not verified');
        }

        // Upload image using your utility
        const imageUrl = await uploadImage(req.file.path);

        // Clean up local temp file
        fs.unlinkSync(req.file.path);      

        if (!imageUrl) {
            throw new apiError(500, 'Image upload failed');
        }

        const product = await Product.create({
            sellerId: seller._id,
            title,
            description,
            image: imageUrl,
            category,
            price,
            availableStock
        });

        return res.status(201).json(new apiResponse('Product added successfully', product));

    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const removeProduct = asyncHandler(async (req, res) => {
    // check  if the logged in user is seller and author
    try {
        const uid = req.user.uid;
        const seller = await Seller.findOne({ firebaseUID: uid });

        if(!seller) {
            throw new apiError(404, 'You must be logged in as a seller to delete a product');
        }

        const productId = req.params.prodId;
        const product = await Product.findById(productId);
        
        if (seller._id.toString() != product.sellerId.toString()) {
            throw new apiError(403, 'You are not authorized to delete this product');
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);

        return res.status(200).json(new apiResponse('Product deleted successfully', deletedProduct));
        
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find();

        if (!products) {
            throw new apiError(404, 'No products found');
        }
        return res.status(200).json(new apiResponse('Products fetched successfully', products));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const getProductById = asyncHandler(async (req, res) => {
    try {
        const productId = req.params.prodId;
        const product = await Product.findById(productId);

        if (!product) {
            throw new apiError(404, 'Product not found');
        }

        return res.status(200).json(new apiResponse('Product fetched successfully', product));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});






