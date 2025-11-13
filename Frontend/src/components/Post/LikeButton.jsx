import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { auth } from '../../config/firebase/firebase';
import { motion } from 'framer-motion';

export default function LikeButton({ postId, initialLikes = [] }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Both buyers and sellers can like posts
  const canLike = isAuthenticated && (role === 'buyer' || role === 'seller');

  useEffect(() => {
    // Ensure initialLikes is always an array
    const likesArray = Array.isArray(initialLikes) ? initialLikes : [];
    setLikesCount(likesArray.length);
    
    // Check if current user has liked this post (works for both buyers and sellers)
    if (user && likesArray.length > 0) {
      const userLiked = likesArray.some(
        (like) => like?.buyerId?.email === user.email || like?.sellerId?.email === user.email
      );
      setIsLiked(userLiked);
    } else {
      setIsLiked(false);
    }
  }, [user, initialLikes]);

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }

    if (!canLike) {
      alert('⚠️ Only buyers and sellers can like posts');
      return;
    }

    setIsLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const endpoint = isLiked ? '/api/v1/like/do-unlike' : '/api/v1/like/do-like';

      const response = await fetch(`${import.meta.env.VITE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      });

      const result = await response.json();

      if (response.ok) {
        // Successfully toggled like/unlike
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      } else {
        // Handle errors gracefully
        const errorMessage = result.message || result.data || 'Failed to update like';
        
        // Check for specific error types
        if (errorMessage.includes('already liked')) {
          // User already liked, sync UI state
          setIsLiked(true);
        } else if (errorMessage.includes('You must be logged in to unlike')) {
          // Trying to unlike when not liked
          setIsLiked(false);
        } else if (response.status === 403) {
          alert('⚠️ You do not have permission to like posts');
        } else if (response.status === 404) {
          alert('❌ Post not found');
        } else {
          alert(`❌ ${errorMessage}`);
        }
      }
    } catch (err) {
      alert('❌ An error occurred while updating like status');
    } finally {
      setIsLoading(false);
    }
  };

  // Show interactive like button for authenticated users
  if (!isAuthenticated) {
    return (
      <div 
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
        onClick={handleLike}
        title="Login to like this post"
      >
        <Heart size={20} />
        <span>{likesCount}</span>
      </div>
    );
  }

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
        isLiked
          ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Heart
        size={20}
        className={`transition-all ${isLiked ? 'fill-current' : ''}`}
      />
      <span>{likesCount}</span>
    </motion.button>
  );
}


