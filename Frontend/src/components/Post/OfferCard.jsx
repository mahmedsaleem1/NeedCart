import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Clock, DollarSign, Check, X, CreditCard } from 'lucide-react';
import { auth } from '../../config/firebase/firebase';
import PaymentRedirect from './PaymentRedirect';

export default function OfferCard({ offer, isPostOwner, postStatus, onOfferUpdated }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/20', 
        text: 'text-yellow-800 dark:text-yellow-400', 
        label: 'Pending' 
      },
      accepted: { 
        bg: 'bg-green-100 dark:bg-green-900/20', 
        text: 'text-green-800 dark:text-green-400', 
        label: 'Accepted' 
      },
      rejected: { 
        bg: 'bg-red-100 dark:bg-red-900/20', 
        text: 'text-red-800 dark:text-red-400', 
        label: 'Rejected' 
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleAccept = async () => {
    if (!window.confirm('Are you sure you want to accept this offer? You will be redirected to payment.')) {
      return;
    }

    setIsProcessing(true);
    try {
      const token = await auth.currentUser.getIdToken();
      
      // Step 1: Initiate payment using TOP (Third-party Online Payment)
      // DON'T accept the offer yet - it will be accepted after successful payment
      setIsRedirectingToPayment(true);
      
      const paymentUrl = `${import.meta.env.VITE_URL}/api/v1/item/buy/${offer._id}`;
      
      const paymentBody = {
        totalPrice: offer.amount,
        address: 'N/A', // Post-based orders don't have shipping address
        quantity: 1,
      };
      
      // The backend expects: itemId (offerId), totalPrice, address, quantity
      const paymentResponse = await fetch(paymentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentBody),
      });
      
      // Check if response is JSON
      const contentType = paymentResponse.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await paymentResponse.text();
        throw new Error('Server returned an invalid response. Please try again.');
      }

      const paymentResult = await paymentResponse.json();

      if (paymentResponse.ok) {
        // Check different possible paths for the Stripe URL
        const stripeUrl = paymentResult.data?.payment?.url || 
                         paymentResult.data?.url || 
                         paymentResult.data?.payment?.data?.url;
        
        if (stripeUrl) {
          // Redirect to Stripe checkout
          // After successful payment, the offer will be accepted via webhook/callback
          window.location.href = stripeUrl;
        } else {
          setIsRedirectingToPayment(false);
          alert(`⚠️ Payment setup failed: No payment URL received.\nPlease contact support.`);
        }
      } else {
        setIsRedirectingToPayment(false);
        const errorMessage = paymentResult.message || paymentResult.data || 'Payment setup failed';
        alert(`❌ ${errorMessage}`);
      }
    } catch (err) {
      setIsRedirectingToPayment(false);
      
      // Show the actual error message
      const errorMessage = err.message || 'An error occurred while processing payment';
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this offer?')) return;

    setIsProcessing(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/offer/reject/${offer._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Offer rejected successfully!');
        onOfferUpdated();
      } else {
        const errorMessage = result.message || result.data || 'Failed to reject offer';
        
        if (response.status === 403) {
          alert('⚠️ You are not authorized to reject this offer');
        } else if (response.status === 404) {
          alert('❌ Offer not found');
        } else {
          alert(`❌ ${errorMessage}`);
        }
      }
    } catch (err) {
      alert('❌ An error occurred while rejecting the offer');
    } finally {
      setIsProcessing(false);
    }
  };

  const showActions = isPostOwner && offer.status === 'pending' && postStatus === 'open';

  return (
    <>
      {isRedirectingToPayment && <PaymentRedirect />}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-shadow"
      >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            <User size={24} />
          </div>
          
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {offer.senderId?.email || 'Anonymous Seller'}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <Clock size={12} />
              <span>
                {new Date(offer.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {getStatusBadge(offer.status)}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign size={16} className="text-[#3772ff]" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Offer Amount</p>
        </div>
        <p className="text-3xl font-bold text-[#3772ff]">
          PKR {offer.amount?.toLocaleString()}
        </p>
      </div>

      {showActions && (
        <div className="flex gap-3">
          <motion.button
            onClick={handleAccept}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check size={18} />
            Accept
          </motion.button>
          <motion.button
            onClick={handleReject}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <X size={18} />
            Reject
          </motion.button>
        </div>
      )}

      {offer.status === 'accepted' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-center">
          <p className="text-sm text-green-800 dark:text-green-400 font-semibold flex items-center justify-center gap-2">
            <Check size={16} />
            This offer has been accepted
          </p>
        </div>
      )}

      {offer.status === 'rejected' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-center">
          <p className="text-sm text-red-800 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
            <X size={16} />
            This offer was rejected
          </p>
        </div>
      )}
    </motion.div>
    </>
  );
}


