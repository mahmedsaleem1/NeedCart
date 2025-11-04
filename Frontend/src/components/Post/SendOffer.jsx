import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { auth } from '../../config/firebase/firebase';

export default function SendOffer({ postId, postBudget, postStatus, onOfferSent }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const role = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Only sellers can send offers
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Please login to send an offer</p>
      </div>
    );
  }

  if (role !== 'seller') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">Only sellers can send offers</p>
      </div>
    );
  }

  if (postStatus === 'closed') {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">This post is closed and no longer accepting offers</p>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/offer/create/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(data.amount) }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Offer sent successfully!');
        reset();
        if (onOfferSent) {
          onOfferSent(result.data);
        }
      } else {
        setError(result.message || 'Failed to send offer');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while sending offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Send Your Offer</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Buyer's Budget:</span> PKR {postBudget?.toLocaleString()}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Offer Amount (PKR) *
          </label>
          <input
            {...register('amount', { 
              required: 'Offer amount is required',
              min: { value: 1, message: 'Amount must be greater than 0' },
              validate: value => value > 0 || 'Amount must be a positive number'
            })}
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your offer amount"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Be competitive! Consider the buyer's budget when making your offer.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition duration-150"
        >
          {isSubmitting ? 'Sending...' : 'Send Offer'}
        </button>
      </form>
    </div>
  );
}