import apiError from '../utills/apiError.js';
import apiResponse from '../utills/apiResponse.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import { Buyer, Seller, Order, EscrowPayout, Admin, Product, Post, Review, Transaction, Wishlist } from '../models/index.js';

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
        return (new apiResponse(201, escrowPayment, 'Escrow payout created successfully'));
    } catch (error) {
        throw new apiError(error.statusCode, `Escrow Payout Creation Error: ${error.message}`);
    }

};

export const getAllOrderPaymentStatus = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) {
            query.escrowStatus = status;
        }

        const orders = await EscrowPayout.find(query)
            .populate({
                path: 'orderId',
                populate: [
                    { path: 'buyerId', select: 'firstName lastName email' },
                    { path: 'sellerId', select: 'firstName lastName email' },
                    { path: 'productId', select: 'title images' }
                ]
            })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalCount = await EscrowPayout.countDocuments(query);

        res.status(200).json(new apiResponse(200, {
            payments: orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalPayments: totalCount,
                limit: parseInt(limit)
            }
        }, 'Fetched all order payment statuses successfully'));
    } catch (error) {
        console.error('Payment status fetch error:', error);
        throw new apiError(error.statusCode || 500, error.message || 'Failed to fetch payment statuses');
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

        const escrow = await EscrowPayout.findByIdAndUpdate(
            escrowId, 
            { 
                escrowStatus: 'released',
                releasedAt: new Date()
            },
            { new: true }
        );

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

// ==================== DASHBOARD ANALYTICS ====================

export const getDashboardOverview = asyncHandler(async (req, res) => {
    try {
        // Get counts
        const totalBuyers = await Buyer.countDocuments();
        const totalSellers = await Seller.countDocuments();
        const verifiedSellers = await Seller.countDocuments({ is_verified: true });
        const pendingSellers = await Seller.countDocuments({ is_verified: false });
        
        const totalProducts = await Product.countDocuments();
        const totalPosts = await Post.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalReviews = await Review.countDocuments();

        // Get revenue data
        const completedOrders = await Order.find({ status: 'delivered' });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        
        const escrowPayments = await EscrowPayout.find();
        const totalPlatformFees = escrowPayments.reduce((sum, escrow) => sum + escrow.platformFee, 0);
        const releasedPayments = await EscrowPayout.countDocuments({ escrowStatus: 'released' });
        const pendingPayments = await EscrowPayout.countDocuments({ escrowStatus: 'held' });

        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const newBuyersLast30Days = await Buyer.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const newSellersLast30Days = await Seller.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const newOrdersLast30Days = await Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const newProductsLast30Days = await Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // Order status breakdown
        const orderStatusCounts = await Order.aggregate([
            {
                $group: {
                    _id: '$deliveryStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Product category distribution
        const productCategoryCounts = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        const overview = {
            users: {
                totalBuyers,
                totalSellers,
                verifiedSellers,
                pendingSellers,
                totalUsers: totalBuyers + totalSellers,
                newBuyersLast30Days,
                newSellersLast30Days
            },
            products: {
                totalProducts,
                totalPosts,
                newProductsLast30Days,
                categoryDistribution: productCategoryCounts
            },
            orders: {
                totalOrders,
                newOrdersLast30Days,
                statusBreakdown: orderStatusCounts
            },
            revenue: {
                totalRevenue,
                totalPlatformFees,
                averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
            },
            payments: {
                releasedPayments,
                pendingPayments,
                totalEscrowPayments: releasedPayments + pendingPayments
            },
            engagement: {
                totalReviews,
                totalWishlists: await Wishlist.countDocuments()
            }
        };

        res.status(200).json(new apiResponse(200, overview, 'Dashboard overview fetched successfully'));
    } catch (error) {
        throw new apiError(error.statusCode || 500, error.message);
    }
});

export const getRevenueAnalytics = asyncHandler(async (req, res) => {
    try {
        const { period = 'month' } = req.query; // day, week, month, year

        let groupByFormat;
        let startDate = new Date();

        switch (period) {
            case 'day':
                groupByFormat = { $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' } };
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'week':
                groupByFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                startDate.setDate(startDate.getDate() - 30);
                break;
            case 'year':
                groupByFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default: // month
                groupByFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                startDate.setMonth(startDate.getMonth() - 3);
        }

        const revenueByPeriod = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: groupByFormat,
                    totalRevenue: { $sum: '$totalPrice' },
                    orderCount: { $sum: 1 },
                    averageOrderValue: { $avg: '$totalPrice' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const platformFeesOverTime = await EscrowPayout.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: groupByFormat,
                    totalFees: { $sum: '$platformFee' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json(new apiResponse(200, {
            revenueByPeriod,
            platformFeesOverTime
        }, 'Revenue analytics fetched successfully'));
    } catch (error) {
        throw new apiError(error.statusCode || 500, error.message);
    }
});

export const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query;
        const skip = (page - 1) * limit;

        let users = [];
        let totalCount = 0;

        const searchQuery = search ? {
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {};

        if (!role || role === 'buyer') {
            const buyers = await Buyer.find(searchQuery)
                .select('-firebaseUID')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });
            
            const buyersWithRole = buyers.map(buyer => ({
                ...buyer.toObject(),
                role: 'buyer'
            }));
            
            users = [...users, ...buyersWithRole];
            totalCount += await Buyer.countDocuments(searchQuery);
        }

        if (!role || role === 'seller') {
            const sellers = await Seller.find(searchQuery)
                .select('-firebaseUID')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });
            
            const sellersWithRole = sellers.map(seller => ({
                ...seller.toObject(),
                role: 'seller'
            }));
            
            users = [...users, ...sellersWithRole];
            totalCount += await Seller.countDocuments(searchQuery);
        }

        res.status(200).json(new apiResponse(200, {
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalUsers: totalCount,
                limit: parseInt(limit)
            }
        }, 'Users fetched successfully'));
    } catch (error) {
        throw new apiError(error.statusCode || 500, error.message);
    }
});

export const getAllSellersRequests = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 20, verified } = req.query;
        const skip = (page - 1) * limit;

        const query = verified !== undefined ? { is_verified: verified === 'true' } : {};

        const sellers = await Seller.find(query)
            .select('-firebaseUID')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalCount = await Seller.countDocuments(query);

        res.status(200).json(new apiResponse(200, {
            sellers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalSellers: totalCount,
                limit: parseInt(limit)
            }
        }, 'Seller requests fetched successfully'));
    } catch (error) {
        throw new apiError(error.statusCode || 500, error.message);
    }
});

export const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) {
            query.deliveryStatus = status;
        }

        const orders = await Order.find(query)
            .populate('buyerId', 'firstName lastName email')
            .populate('sellerId', 'firstName lastName email')
            .populate('productId', 'title price images')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalCount = await Order.countDocuments(query);

        res.status(200).json(new apiResponse(200, {
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalOrders: totalCount,
                limit: parseInt(limit)
            }
        }, 'Orders fetched successfully'));
    } catch (error) {
        throw new apiError(error.statusCode || 500, error.message);
    }
});

export const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 20, category, search } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (category) {
            query.category = category;
        }
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query)
            .populate('sellerId', 'firstName lastName email is_verified')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalCount = await Product.countDocuments(query);

        res.status(200).json(new apiResponse(200, {
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalProducts: totalCount,
                limit: parseInt(limit)
            }
        }, 'Products fetched successfully'));
    } catch (error) {
        throw new apiError(error.statusCode || 500, error.message);
    }
});

export const getAllPosts = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await Post.find(query)
            .populate('buyerId', 'firstName lastName email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalCount = await Post.countDocuments(query);

        res.status(200).json(new apiResponse(200, {
            posts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalPosts: totalCount,
                limit: parseInt(limit)
            }
        }, 'Posts fetched successfully'));
    } catch (error) {
        throw new apiError(error.statusCode || 500, error.message);
    }
});

export const getTransactionHistory = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) {
            query.paymentStatus = status;
        }

        const transactions = await Transaction.find(query)
            .populate('buyerId', 'firstName lastName email')
            .populate('sellerId', 'firstName lastName email')
            .populate('productId', 'title images price')
            .populate('offerId')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .lean();

        const totalCount = await Transaction.countDocuments(query);

        res.status(200).json(new apiResponse(200, {
            transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalTransactions: totalCount,
                limit: parseInt(limit)
            }
        }, 'Transactions fetched successfully'));
    } catch (error) {
        console.error('Transaction fetch error:', error);
        throw new apiError(error.statusCode || 500, error.message || 'Failed to fetch transactions');
    }
});

export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { userId, role } = req.params;

        if (role === 'buyer') {
            const buyer = await Buyer.findByIdAndDelete(userId);
            if (!buyer) {
                throw new apiError(404, 'Buyer not found');
            }
        } else if (role === 'seller') {
            const seller = await Seller.findByIdAndDelete(userId);
            if (!seller) {
                throw new apiError(404, 'Seller not found');
            }
        } else {
            throw new apiError(400, 'Invalid role specified');
        }

        res.status(200).json(new apiResponse(200, null, 'User deleted successfully'));
    } catch (error) {
        throw new apiError(error.statusCode || 500, error.message);
    }
});

export const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            throw new apiError(404, 'Product not found');
        }

        res.status(200).json(new apiResponse(200, null, 'Product deleted successfully'));
    } catch (error) {
        throw new apiError(error.statusCode || 500, error.message);
    }
});

export const deletePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            throw new apiError(404, 'Post not found');
        }

        res.status(200).json(new apiResponse(200, null, 'Post deleted successfully'));
    } catch (error) {
        throw new apiError(error.statusCode || 500, error.message);
    }
});
