import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Seller, Post, Product, Order, Transaction, Offer } from '../models/index.js';
import {createEscrowPayout_INTERNAL} from './admin.controller.js'

// Helper: validate and normalize desired status
const ALLOWED_ORDER_STATUS = ['pending', 'confirmed', 'delivered', 'cancelled'];

// Place an order for either a Product (with quantity and stock check) or a Post (via accepted Offer)
// Expects: req.user (firebase), transaction id in params as :Tid or in body as transactionId
// For products: body { address, quantity }
// For posts/offers: body { address } and underlying transaction.offerId must be present
 
export const createOrder_INTERNAL = async (uid, transactionId, address, quantity) => {
	// in the pending state uptill transaction is 'paid' than 'confirmed'
	try {
		if (!uid) throw new apiError(401, 'Authentication required');

		const buyer = await Buyer.findOne({ firebaseUID: uid });
		if (!buyer) throw new apiError(404, 'You must be logged in as a buyer to place an order');

		// can be stored in middleware or session also
		if (!transactionId) throw new apiError(400, 'Transaction id is required'); // transaction having 'pending status'

		const transaction = await Transaction.findById(transactionId);
		if (!transaction) throw new apiError(404, 'Transaction not found');
		if (transaction.buyerId.toString() !== buyer._id.toString()) {
			throw new apiError(403, 'This transaction does not belong to you');
		}

		if (!address || !address.trim()) throw new apiError(400, 'Delivery address is required');
		
		let orderPayload = {
			buyerId: buyer._id,
			sellerId: transaction.sellerId,
			address: address.trim(),
			transactionId: transaction._id,
			status: 'pending',
			quantity: quantity ?? 1,
			totalPrice: transaction.totalPrice,
		};

		// Case 1: Product-based order
		if (transaction.productId) {
			const product = await Product.findById(transaction.productId);
			if (!product) throw new apiError(404, 'Product associated with transaction not found');

			// Verify stock and pricing
			if (product.availableStock < quantity) {
				throw new apiError(400, 'Insufficient product stock');
			}

			const expectedTotal = Number(product.price) * quantity;
			if (Number(transaction.totalPrice) !== expectedTotal) {
				throw new apiError(400, 'Total price does not match product price x quantity');
			}

			// Prepare order payload
			orderPayload.productId = product._id;
			
			orderPayload.totalPrice = expectedTotal;

			// Deduct stock
			product.availableStock = product.availableStock - quantity;
			await product.save();
		}

		// Case 2: Post/Offer-based order
		if (!transaction.productId && transaction.offerId) {
			const offer = await Offer.findById(transaction.offerId);
			if (!offer) throw new apiError(404, 'Offer associated with transaction not found');

			// Verify offer is not rejected (allow pending or accepted)
			if (offer.status === 'rejected') {
				throw new apiError(400, 'Cannot place order for a rejected offer');
			}

			// Map to post order
			orderPayload.postId = offer.postId;

			// For offers, quantity defaults to 1 and totalPrice already set by transaction
			const post = await Post.findById(offer.postId);
			if (!post) throw new apiError(404, 'Post associated with offer not found');
		}

		// Ensure at least one of productId or postId is set (order schema requires one)
		if (!orderPayload.productId && !orderPayload.postId) {
			throw new apiError(400, 'Order must be for a product or a post');
		}

		const order = await Order.create(orderPayload);

		const escrow = await createEscrowPayout_INTERNAL(order);

		return(new apiResponse(201, { order, escrow }, 'Order placed successfully'));
	} catch (error) {
		throw new apiError(error.statusCode, error.message);
	}
};

export const createOrderCOD_INTERNAL = async (uid, transactionId, address, quantity) => {
	try {
		if (!uid) throw new apiError(401, 'Authentication required');

		const buyer = await Buyer.findOne({ firebaseUID: uid });
		if (!buyer) throw new apiError(404, 'You must be logged in as a buyer to place an order');

		if (!transactionId) throw new apiError(400, 'Transaction id is required'); // transaction having 'pending status'

		const transaction = await Transaction.findById(transactionId);
		if (!transaction) throw new apiError(404, 'Transaction not found');
		if (transaction.buyerId.toString() !== buyer._id.toString()) {
			throw new apiError(403, 'This transaction does not belong to you');
		}

		if (!address || !address.trim()) throw new apiError(400, 'Delivery address is required');
		
		let orderPayload = {
			buyerId: buyer._id,
			sellerId: transaction.sellerId,
			address: address.trim(),
			transactionId: transaction._id,
			status: 'confirmed',
			quantity: quantity ?? 1,
			totalPrice: transaction.totalPrice,
		};

		// Case 1: Product-based order
		if (transaction.productId) {
			const product = await Product.findById(transaction.productId);
			if (!product) throw new apiError(404, 'Product associated with transaction not found');

			// Verify stock and pricing
			if (product.availableStock < quantity) {
				throw new apiError(400, 'Insufficient product stock');
			}

			const expectedTotal = Number(product.price) * quantity;
			if (Number(transaction.totalPrice) !== expectedTotal) {
				throw new apiError(400, 'Total price does not match product price x quantity');
			}

			// Prepare order payload
			orderPayload.productId = product._id;
			
			orderPayload.totalPrice = expectedTotal;

			// Deduct stock
			product.availableStock = product.availableStock - quantity;
			await product.save();
		}

		// Case 2: Post/Offer-based order
		if (!transaction.productId && transaction.offerId) {
			const offer = await Offer.findById(transaction.offerId);
			if (!offer) throw new apiError(404, 'Offer associated with transaction not found');

			// Verify offer is not rejected (allow pending or accepted)
			if (offer.status === 'rejected') {
				throw new apiError(400, 'Cannot place order for a rejected offer');
			}

			// Map to post order
			orderPayload.postId = offer.postId;

			// For offers, quantity defaults to 1 and totalPrice already set by transaction
			const post = await Post.findById(offer.postId);
			if (!post) throw new apiError(404, 'Post associated with offer not found');
		}

		// Ensure at least one of productId or postId is set (order schema requires one)
		if (!orderPayload.productId && !orderPayload.postId) {
			throw new apiError(400, 'Order must be for a product or a post');
		}

		const order = await Order.create(orderPayload);
		return(new apiResponse(201, order, 'Order placed successfully'));
	} catch (error) {
		throw new apiError(error.statusCode, error.message);
	}
};

export const updateOrderStatus_INTERNAL = async (orderId, status) => {
	try { // From Pending to confirmed

		const order = await Order.findById(orderId);
		if (!order) {
			throw new apiError(404, 'Order not found.');
		}
		order.status = status;
		await order.save();
		return (new apiResponse(201, order, 'Order updated successfully.'));
	} catch (error) {
		throw new apiError(error.statusCode, error.message);  
	}
};

export const createOrder = asyncHandler(async (req, res) => {
	// in the pending state uptill transaction is 'paid' than 'confirmed'
	try {
		const uid = req.user?.uid;
		if (!uid) throw new apiError(401, 'Authentication required');

		const buyer = await Buyer.findOne({ firebaseUID: uid });
		if (!buyer) throw new apiError(404, 'You must be logged in as a buyer to place an order');

		// can be stored in middleware or session also
		const transactionId = req.body?.transactionId; // transaction having 'pending status'
		if (!transactionId) throw new apiError(400, 'Transaction id is required');

		const transaction = await Transaction.findById(transactionId);
		if (!transaction) throw new apiError(404, 'Transaction not found');
		if (transaction.buyerId.toString() !== buyer._id.toString()) {
			throw new apiError(403, 'This transaction does not belong to you');
		}
		// if (transaction.paymentStatus !== 'paid') {
		// 	throw new apiError(400, 'Payment must be completed before placing an order');
		// }

		const address = req.body.address;
        const quantity = req.body.quantity;

		if (!address || !address.trim()) throw new apiError(400, 'Delivery address is required');
        if (!quantity || !Number.isInteger(quantity) || quantity < 1) throw new apiError(400, 'Quantity is required');

		let orderPayload = {
			buyerId: buyer._id,
			sellerId: transaction.sellerId,
			address: address.trim(),
			transactionId: transaction._id,
			status: 'pending',
			quantity,
			totalPrice: transaction.totalPrice,
		};

		// Case 1: Product-based order
		if (transaction.productId) {
			const product = await Product.findById(transaction.productId);
			if (!product) throw new apiError(404, 'Product associated with transaction not found');

			// const quantity = Number(req.body?.quantity ?? 1);
			// if (!Number.isInteger(quantity) || quantity < 1) {
			// 	throw new apiError(400, 'Quantity must be a positive integer');
			// }

			// Verify stock and pricing
			if (product.availableStock < quantity) {
				throw new apiError(400, 'Insufficient product stock');
			}

			const expectedTotal = Number(product.price) * quantity;
			if (Number(transaction.totalPrice) !== expectedTotal) {
				throw new apiError(400, 'Total price does not match product price x quantity');
			}

			// Prepare order payload
			orderPayload.productId = product._id;
			// orderPayload.quantity = quantity;
			orderPayload.totalPrice = expectedTotal;

			// Deduct stock
			product.availableStock = product.availableStock - quantity;
			await product.save();
		}

		// Case 2: Post/Offer-based order
		if (!transaction.productId && transaction.offerId) {
			const offer = await Offer.findById(transaction.offerId);
			if (!offer) throw new apiError(404, 'Offer associated with transaction not found');

			// Verify offer is not rejected (allow pending or accepted)
			if (offer.status === 'rejected') {
				throw new apiError(400, 'Cannot place order for a rejected offer');
			}

			// Map to post order
			orderPayload.postId = offer.postId;

			// For offers, quantity defaults to 1 and totalPrice already set by transaction
			const post = await Post.findById(offer.postId);
			if (!post) throw new apiError(404, 'Post associated with offer not found');
		}

		// Ensure at least one of productId or postId is set (order schema requires one)
		if (!orderPayload.productId && !orderPayload.postId) {
			throw new apiError(400, 'Order must be for a product or a post');
		}

		const order = await Order.create(orderPayload);
		return res.status(201).json(new apiResponse(201, order, 'Order placed successfully'));
	} catch (error) {
		throw new apiError(error.statusCode, error.message);
	}
});

// Get single order with details; buyer or seller who owns the order can view
export const getOrderDetails = asyncHandler(async (req, res) => {
	try {
		const uid = req.user?.uid;
		if (!uid) throw new apiError(401, 'Authentication required');

		const buyer = await Buyer.findOne({ firebaseUID: uid });
		const seller = await Seller.findOne({ firebaseUID: uid });

		const orderId = req.params?.orderId;
		if (!orderId) throw new apiError(400, 'Order id is required');

		const order = await Order.findById(orderId)
			.populate('buyerId', 'email')
			.populate('sellerId', 'email')
			.populate('productId')
			.populate('postId')
			.populate('transactionId');

		if (!order) throw new apiError(404, 'Order not found');

		// Authorization: only the buyer or seller tied to the order can view
		const isBuyer = buyer && order.buyerId && buyer.email === order.buyerId.email;
		const isSeller = seller && order.sellerId && seller.email === order.sellerId.email;
		if (!isBuyer && !isSeller) {
			throw new apiError(403, 'You are not authorized to view this order');
		}

		return res.status(200).json(new apiResponse(200, order, 'Order fetched successfully'));
	} catch (error) {
		throw new apiError(error.statusCode || 500, error.message || 'Failed to fetch order details');
	}
}); // Incl Product, Post, Transaction details

// Sellers can confirm/deliver/cancel their orders; Buyers can cancel their own orders
export const updateOrderStatus = asyncHandler(async (req, res) => {
	try {
		const uid = req.user?.uid;
		if (!uid) throw new apiError(401, 'Authentication required');

		const orderId = req.params?.orderId;
		const { status } = req.body || {};
		if (!orderId) throw new apiError(400, 'Order id is required');
		if (!status || !ALLOWED_ORDER_STATUS.includes(status)) {
			throw new apiError(400, 'Invalid order status');
		}

		const order = await Order.findById(orderId);
		if (!order) throw new apiError(404, 'Order not found');

		const buyer = await Buyer.findOne({ firebaseUID: uid });
		const seller = await Seller.findOne({ firebaseUID: uid });

		const isOrderBuyer = buyer && order.buyerId.toString() === buyer._id.toString();
		const isOrderSeller = seller && order.sellerId.toString() === seller._id.toString();

		// Authorization rules
		// - Buyers can only cancel their own pending/confirmed orders
		// - Sellers can update to confirmed/delivered/cancelled for their orders
		if (isOrderBuyer) {
			if (status !== 'cancelled') {
				throw new apiError(403, 'Buyers can only cancel their orders');
			}
		} else if (!isOrderSeller) {
			throw new apiError(403, 'You are not authorized to update this order');
		}

		// Handle stock adjustments on cancel and timestamps on delivered/cancelled
		if (status === 'delivered') {
			order.deliveredAt = new Date();
		}
		if (status === 'cancelled') {
			order.cancelledAt = new Date();
			// Return stock for product-based orders
			if (order.productId) {
				const product = await Product.findById(order.productId);
				if (product) {
					product.availableStock += order.quantity;
					await product.save();
				}
			}
		}

		order.status = status;
		await order.save();

		return res.status(200).json(new apiResponse(200, { order }, 'Order status updated successfully'));
	} catch (error) {
		throw new apiError(error.statusCode || 500, error.message || 'Failed to update order status');
	}
});

export const getBuyerOrders = asyncHandler(async (req, res) => {
	try {
		const uid = req.user?.uid;
		if (!uid) throw new apiError(401, 'Authentication required');

		const buyer = await Buyer.findOne({ firebaseUID: uid });
		if (!buyer) throw new apiError(404, 'You must be logged in as a buyer');

		const orders = await Order.find({ buyerId: buyer._id })
			.sort({ createdAt: -1 })
			.populate('productId')
			.populate('postId')
			.populate('transactionId');

		return res.status(200).json(new apiResponse(200, { orders }, 'Buyer orders retrieved successfully'));
	} catch (error) {
		throw new apiError(error.statusCode || 500, error.message || 'Failed to get buyer orders');
	}
});

export const getSellerOrders = asyncHandler(async (req, res) => {
	try {
		const uid = req.user?.uid;
		if (!uid) throw new apiError(401, 'Authentication required');

		const seller = await Seller.findOne({ firebaseUID: uid });
		if (!seller) throw new apiError(404, 'You must be logged in as a seller');

		const orders = await Order.find({ sellerId: seller._id })
			.sort({ createdAt: -1 })
			.populate('productId')
			.populate('postId')
			.populate('transactionId');

		return res.status(200).json(new apiResponse(200, orders, 'Seller orders retrieved successfully'));
	} catch (error) {
		throw new apiError(error.statusCode || 500, error.message || 'Failed to get seller orders');
	}
});
