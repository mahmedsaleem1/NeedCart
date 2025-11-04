import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
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

      const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/comment/do-comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: data.content }),
      });

      const result = await response.json();

      if (result.success) {
        reset(); // Clear the form
        if (onCommentAdded) {
          onCommentAdded(result.data); // Notify parent component
        }
      } else {
        setError(result.message || 'Failed to add comment');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while adding comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-gray-600">Please login to comment</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <textarea
            {...register('content', { 
              required: 'Comment cannot be empty',
              minLength: { value: 1, message: 'Comment is too short' }
            })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Write your comment..."
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition duration-150"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}