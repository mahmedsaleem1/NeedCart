import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  DollarSign, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Heart,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  MoreVertical,
  Image as ImageIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostsManagement({ posts, loading, onUpdateStatus, onDelete }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Posts Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You haven't created any posts yet.
        </p>
        <button
          onClick={() => navigate("/create-post")}
          className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-rose-600 transition-all duration-300 shadow-lg"
        >
          Create Your First Post
        </button>
      </div>
    );
  }

  const handleStatusToggle = (postId, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    onUpdateStatus(postId, newStatus);
    setExpandedMenu(null);
  };

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      onDelete(postId);
      setExpandedMenu(null);
    }
  };

  const toggleMenu = (postId) => {
    setExpandedMenu(expandedMenu === postId ? null : postId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
        >
          {/* Post Image */}
          <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize flex items-center gap-1 ${
                post.status === 'open'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
              }`}>
                {post.status === 'open' ? (
                  <Unlock className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {post.status}
              </span>
            </div>

            {/* Actions Menu */}
            <div className="absolute top-3 right-3">
              <button
                onClick={() => toggleMenu(post._id)}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              <AnimatePresence>
                {expandedMenu === post._id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10"
                  >
                    <button
                      onClick={() => navigate(`/posts/${post._id}`)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleStatusToggle(post._id, post.status)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                    >
                      {post.status === 'open' ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Close Post
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          Reopen Post
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors rounded-b-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Post
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {post.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">${post.budget?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <button
                onClick={() => navigate(`/posts/${post._id}`)}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
