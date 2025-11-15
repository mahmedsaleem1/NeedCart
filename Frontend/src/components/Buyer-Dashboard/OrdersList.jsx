import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  Box,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function OrdersList({ orders, loading }) {
  const [expandedOrder, setExpandedOrder] = useState(null);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Orders Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <Package className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {order.productId?.name || order.postId?.title || 'Order'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order ID: {order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {expandedOrder === order._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">${order.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Box className="w-4 h-4" />
                <span className="text-sm">Qty: {order.quantity}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <AnimatePresence>
              {expandedOrder === order._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Delivery Address
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.address}
                        </p>
                      </div>
                    </div>

                    {order.productId && (
                      <div className="flex items-start gap-2">
                        <Box className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Product Details
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.productId.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    )}

                    {order.postId && (
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Post Request
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Budget: ${order.postId.budget?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {order.deliveredAt && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Delivered On
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(order.deliveredAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
