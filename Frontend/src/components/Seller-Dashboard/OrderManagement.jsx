import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Loader2, AlertCircle, Calendar, MapPin, User } from "lucide-react";
import { auth } from "../../config/firebase/firebase";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_URL}/order/seller-orders`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    if (!orderId) return;

    const confirmDelivery = window.confirm(
      "Mark this order as delivered?\n\n" +
      "Note: Payment will remain held until the admin releases it. " +
      "You'll see the payment in 'Released Payments' once approved by admin."
    );

    if (!confirmDelivery) return;

    try {
      setUpdatingOrderId(orderId);
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_URL}/seller-dashboard/update-order-status/${orderId}`,
        {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      // Refresh orders list
      await fetchOrders();
      alert("Order marked as delivered! Payment will be released by admin shortly.");
      
      // Trigger a page refresh or emit an event to refresh held payments
      window.dispatchEvent(new Event('orderStatusUpdated'));
    } catch (err) {
      console.error("Error updating order:", err);
      alert(err.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-[#3772ff] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
          No Active Orders
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          You don't have any active orders to manage.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Truck className="w-6 h-6 text-[#3772ff] dark:text-[#5c8cff]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Lemon Milk', sans-serif" }}>
            All Orders
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Manage all your orders - Mark confirmed orders as delivered
          </p>
        </div>
      </div>

      <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          <strong>Note:</strong> After marking an order as delivered, the payment will remain in "Held Payments" 
          until the admin verifies and releases it. Once released, it will appear in "Released Payments".
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order, index) => {
          const statusConfig = {
            pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Pending' },
            confirmed: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Confirmed' },
            delivered: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Delivered' },
            cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Cancelled' }
          };
          const status = statusConfig[order.status] || statusConfig.confirmed;
          const canMarkDelivered = order.status === 'confirmed';

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 ${status.bg} ${status.text} rounded-full text-xs font-semibold`}>
                      {status.label}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Order #{order._id?.slice(-8) || 'N/A'}
                    </span>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Buyer: {order.buyerId?.email || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span className="text-sm line-clamp-2">{order.address || 'No address provided'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Package className="w-4 h-4" />
                      <span className="text-sm">Quantity: {order.quantity || 1}</span>
                    </div>
                  </div>
                </div>

                {(order.productId || order.postId) && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.productId ? 'Product' : 'Post'}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {order.productId?.title || order.postId?.title || 'N/A'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between items-end space-y-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                  <p className="text-3xl font-extrabold text-[#3772ff] dark:text-[#5c8cff]" style={{ fontFamily: "'Lemon Milk', sans-serif" }}>
                    ${order.totalPrice?.toFixed(2) || '0.00'}
                  </p>
                </div>

                {canMarkDelivered ? (
                  <button
                    onClick={() => handleMarkAsDelivered(order._id)}
                    disabled={updatingOrderId === order._id}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingOrderId === order._id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Mark as Delivered
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-center px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                      {order.status === 'delivered' && 'Order Delivered'}
                      {order.status === 'cancelled' && 'Order Cancelled'}
                      {order.status === 'pending' && 'Payment Pending'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
        })}
      </div>
    </div>
  );
}
