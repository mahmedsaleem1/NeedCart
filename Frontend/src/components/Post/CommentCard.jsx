import { useState } from 'react';
import { useSelector } from 'react-redux';
import { auth } from '../../config/firebase/firebase';

export default function CommentCard({ comment, onCommentDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // Determine who posted the comment
  const commenterEmail = comment.buyerId?.email || comment.sellerId?.email;
  const commenterRole = comment.buyerId ? 'Buyer' : 'Seller';
  
  // Check if current user owns this comment
  const isOwner = user && (user.email === commenterEmail);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/comment/delete-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ commentId: comment._id }),
      });

      const result = await response.json();

      if (result.success) {
        if (onCommentDeleted) {
          onCommentDeleted(comment._id);
        }
      } else {
        alert(result.message || 'Failed to delete comment');
      }
    } catch (err) {
      alert(err.message || 'An error occurred while deleting comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {commenterEmail?.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{commenterEmail}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                commenterRole === 'Buyer' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {commenterRole}
              </span>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed">
              {comment.content}
            </p>
            
            <p className="text-xs text-gray-400 mt-2">
              {new Date(comment.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete comment"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}