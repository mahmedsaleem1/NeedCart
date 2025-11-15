import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { auth } from '../../config/firebase/firebase';

export default function AddComment({ postId, onCommentAdded }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_URL}/comment/do-comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: data.content }),
      });

      const result = await response.json();

      if (response.ok && result.data) {
        reset();
        if (onCommentAdded) {
          onCommentAdded(result.data);
        }
      } else {
        // Handle errors gracefully
        const errorMessage = result.message || result.data || 'Failed to add comment';
        
        if (response.status === 400) {
          setError('⚠️ Comment cannot be empty');
        } else if (response.status === 404) {
          setError('❌ Post not found');
        } else {
          setError(`❌ ${errorMessage}`);
        }
      }
    } catch (err) {
      setError('❌ An error occurred while adding comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-center">
        <p className="text-gray-600 dark:text-gray-300">Please login to comment</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <textarea
            {...register('content', { 
              required: 'Comment cannot be empty',
              minLength: { value: 1, message: 'Comment is too short' }
            })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-[#3772ff] focus:border-[#3772ff] resize-none transition-all"
            placeholder="Write your comment..."
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#3772ff] to-[#5c8cff] text-white px-6 py-2 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center gap-2"
          >
            <Send size={18} />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}


