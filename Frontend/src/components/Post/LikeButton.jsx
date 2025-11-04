import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { auth } from '../../config/firebase/firebase';

export default function LikeButton({ postId, initialLikes = [] }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes.length);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Check if current user has liked this post
    if (user && initialLikes.length > 0) {
      const userLiked = initialLikes.some(
        like => like.buyerId?.email === user.email || like.sellerId?.email === user.email
      );
      setIsLiked(userLiked);
    }
  }, [user, initialLikes]);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent triggering parent onClick

    if (!isAuthenticated) {
      alert('Please login to like posts');
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

      if (result.success) {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      } else {
        alert(result.message || 'Failed to update like');
      }
    } catch (err) {
      alert(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isLiked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <svg
        className={`w-5 h-5 transition-transform ${isLiked ? 'scale-110' : ''}`}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-medium">{likesCount}</span>
    </button>
  );
}