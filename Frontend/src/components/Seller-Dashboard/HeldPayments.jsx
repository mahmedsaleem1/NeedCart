import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Package, DollarSign, Calendar, Loader2, AlertCircle } from "lucide-react";
import { auth } from "../../config/firebase/firebase";

export default function HeldPayments() {
  const [heldOrders, setHeldOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHeldPayments();
    
    // Listen for order status updates
    const handleOrderUpdate = () => {
      fetchHeldPayments();
    };
    
    window.addEventListener('orderStatusUpdated', handleOrderUpdate);
    
    return () => {
      window.removeEventListener('orderStatusUpdated', handleOrderUpdate);
    };
  }, []);

  const fetchHeldPayments = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_URL}/seller-dashboard/get-held-payment-orders`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch held payments");
      }

      setHeldOrders(data.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching held payments:", err);
      setError(err.message || "Failed to load held payments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
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

  if (heldOrders.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
        <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
          No Held Payments
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          You don't have any held payments at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
          <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Lemon Milk', sans-serif" }}>
            Held Payments
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Payments held in escrow - awaiting admin approval for release
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {heldOrders.map((payment, index) => (
          <motion.div
            key={payment._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-semibold">
                    Held
                  </span>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">
                    {payment.orderId?.status || 'Confirmed'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Package className="w-4 h-4" />
                    <span>Order ID: {payment.orderId?._id?.slice(-8) || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">Net Amount: ${payment.netAmount?.toFixed(2) || '0.00'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Ordered: {payment.orderId?.createdAt ? new Date(payment.orderId.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>Total: ${payment.orderId?.totalPrice?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>

                {(payment.orderId?.productId || payment.orderId?.postId) && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                      {payment.orderId?.productId ? 'Product' : 'Post'}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {payment.orderId?.productId?.title || payment.orderId?.postId?.title || 'N/A'}
                    </p>
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="text-3xl font-extrabold text-orange-600 dark:text-orange-400" style={{ fontFamily: "'Lemon Milk', sans-serif" }}>
                  ${payment.netAmount?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Platform Fee: ${payment.platformFee?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
