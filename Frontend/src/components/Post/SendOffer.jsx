import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Send, DollarSign } from 'lucide-react';
import { auth } from '../../config/firebase/firebase';

export default function SendOffer({ postId, onOfferSent }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_URL}/offer/create/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(data.amount) }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Offer sent successfully!');
        reset();
        setShowForm(false);
        if (onOfferSent) {
          onOfferSent(result.data);
        }
      } else {
        // Handle errors gracefully
        const errorMessage = result.message || result.data || 'Failed to send offer';
        
        if (response.status === 400) {
          if (errorMessage.includes('closed')) {
            setError('⚠️ Cannot send offer - post is closed');
          } else {
            setError('⚠️ Invalid offer amount');
          }
        } else if (response.status === 403) {
          setError('⚠️ You do not have permission to send offers');
        } else if (response.status === 404) {
          setError('❌ Post not found');
        } else {
          setError(`❌ ${errorMessage}`);
        }
      }
    } catch (err) {
      setError('❌ An error occurred while sending offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <motion.button
        onClick={() => setShowForm(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
      >
        <Send size={20} />
        Send Offer
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-lg"
    >
      <h3
        className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
        style={{ fontFamily: "'Lemon Milk', sans-serif" }}
      >
        Send Your Offer
      </h3>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Offer Amount (PKR) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('amount', { 
                required: 'Offer amount is required',
                min: { value: 1, message: 'Amount must be greater than 0' },
                validate: value => value > 0 || 'Amount must be a positive number'
              })}
              type="number"
              step="0.01"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 transition-all"
              placeholder="Enter your offer amount"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Be competitive! Consider the buyer's budget when making your offer.
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={() => setShowForm(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white py-3 px-6 rounded-xl font-semibold transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {isSubmitting ? 'Sending...' : 'Send Offer'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}


