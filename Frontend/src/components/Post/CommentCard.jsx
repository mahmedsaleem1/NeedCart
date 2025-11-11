import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Trash2, User, Clock } from 'lucide-react';
import { auth } from '../../config/firebase/firebase';

export default function CommentCard({ comment, onDelete, isPostOwner = false, postOwnerId = null }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const commenterEmail = comment.buyerId?.email || comment.sellerId?.email || 'Anonymous';
  
  // User can delete if they own the comment
  const isCommentOwner = user && (
    (comment.buyerId?.email === user.email) || 
    (comment.sellerId?.email === user.email)
  );
  
  // Allow deletion if user is comment owner OR post owner
  const canDelete = isCommentOwner || isPostOwner;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

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

      if (response.ok) {
        onDelete(comment._id);
      } else {
        // Handle errors gracefully
        const errorMessage = result.message || result.data || 'Failed to delete comment';
        
        if (response.status === 403) {
          alert('⚠️ You can only delete your own comments');
        } else if (response.status === 404) {
          alert('❌ Comment not found');
        } else {
          alert(`❌ ${errorMessage}`);
        }
      }
    } catch (err) {
      alert('❌ An error occurred while deleting the comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3772ff] to-blue-400 flex items-center justify-center text-white font-semibold">
              <User size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{commenterEmail}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} />
                <span>
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 ml-13 pl-0.5">{comment.content}</p>
        </div>

        {canDelete && (
          <motion.button
            onClick={handleDelete}
            disabled={isDeleting}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
            title={isPostOwner && !isCommentOwner ? "Delete (Post Owner)" : "Delete"}
          >
            <Trash2 size={18} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
