import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Seller, Rent } from '../models/index.js';
import { uploadImage } from '../utills/cloudinary.utill.js';
import fs from 'fs';

// Seller can list items on rent
// RENT SCHEMA : sellerId, item_name, item_description, rental_price, rental_duration, advance_amount, availability_status
// Buyer can view available items for rent and request to rent an item

export const listItemForRent = asyncHandler(async (req, res) => {
    try {
        const uid = req.user.uid;
        const image_path = req.file.path;
    
        const imageUrl = await uploadImage(image_path);
                console.log("image URL", imageUrl);

        fs.unlinkSync(image_path);     
        
        const { item_name, item_description, rental_price, rental_duration, advance_amount } = req.body;

        const seller = await Seller.findOne({
            firebaseUID: uid
        });
    
        if (!seller) {
            throw new apiError(401, 'You must be logged in as a seller to list an item for rent');
        }
    
        if (!item_name || !item_description || !rental_price || !rental_duration || !advance_amount || !imageUrl) {
            throw new apiError(400, 'All fields are required');
        }
    
        const rentItem = await Rent.create({
            sellerId: seller._id,
            item_name,
            item_description,
            item_image: imageUrl,
            rental_price,
            rental_duration,
            advance_amount
        });
        
        if (!rentItem) {
            throw new apiError(500, 'Unable to list item for rent');
        }

        return res.status(201).json(new apiResponse(201, 'Item listed for rent successfully', rentItem));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }   
});

export const removeItemFromRent = asyncHandler(async (req, res) => {
    // only seller who listed the item can remove it from rent
    try {
        const uid = req.user.uid;
        const rentItemId = req.params.rentId;
        console.log(rentItemId);
        

        const seller = await Seller.findOne({
            firebaseUID: uid
        });

        const rentItem = await Rent.findById(rentItemId);
        console.log(rentItem);
        
        if (!rentItem) {
            throw new apiError(404, 'Rent item not found');
        }
        if (rentItem.sellerId.toString() !== seller._id.toString()) {
            throw new apiError(403, 'You are not authorized to remove this item from rent');
        }

        const deletedRentalItem = await Rent.findByIdAndDelete(rentItemId);

        return res.status(200).json(new apiResponse(200, 'Item removed from rent successfully', deletedRentalItem));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const viewAllRentalItems = asyncHandler(async (req, res) => {
    // both seller n buyer can view available items for rent
    try {
        const rentalItems = await Rent.find();
        
        return res.status(200).json(new apiResponse(200, 'Available rental items retrieved successfully', rentalItems));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

export const requestToRentItem = asyncHandler(async (req, res) => {
    // only buyer can request to rent an item
    // item  must be available for rent
    try {
        const uid = req.user.uid;
        const rentItemId = req.params.rentId;

        const buyer = await Buyer.findOne({
            firebaseUID: uid
        });

        if (!buyer) {
            throw new apiError(401, 'You must be logged in as a buyer to request to rent an item');
        }

        const rentItem = await Rent.findById(rentItemId);
        if (!rentItem || !rentItem.availability_status) {
            throw new apiError(404, 'Item not available for rent');
        }

        // TODO: Implement payment processing for advance amount here

        const updatedRentItem = await Rent.findByIdAndUpdate(rentItemId, {
            buyerId: buyer._id,
            availability_status: false
        }, { new: true });

        return res.status(200).json(new apiResponse(200, 'Rent request successful', updatedRentItem));
    } catch (error) {
        throw new apiError(error.statusCode, error.message);
    }
});

