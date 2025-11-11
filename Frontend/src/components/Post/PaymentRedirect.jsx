import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader } from 'lucide-react';

export default function PaymentRedirect() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#3772ff] to-blue-400 rounded-full flex items-center justify-center"
        >
          <CreditCard size={40} className="text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#3772ff] to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: 'Lemon Milk, sans-serif' }}>
          Redirecting to Payment
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please wait while we prepare your secure checkout session...
        </p>

        <div className="flex items-center justify-center gap-2 text-[#3772ff]">
          <Loader size={20} className="animate-spin" />
          <span className="text-sm font-semibold">Processing</span>
        </div>
      </motion.div>
    </div>
  );
}
