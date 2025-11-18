import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, DollarSign, Eye, User, MessageCircle, Send } from "lucide-react";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 max-w-2xl mx-auto"
    >
      {/* Post Header - User Info */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 flex items-center justify-center text-white font-bold">
            {post.buyerId?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {post.buyerId?.email?.split('@')[0] || "Anonymous"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock size={12} />
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Date not available"}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            post.status === "open" 
              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          {post.status === "open" ? "Open" : "Closed"}
        </span>
      </div>

      {/* Post Image */}
      <div 
        className="relative w-full cursor-pointer"
        onClick={() => navigate(`/post/${post._id}`)}
      >
        <img
          src={post.image || "/placeholder.png"}
          alt={post.title || "Post Image"}
          className="w-full max-h-[500px] object-cover"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(`/post/${post._id}`)}
          className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
        >
          <MessageCircle size={24} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(`/post/${post._id}`)}
          className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
        >
          <Send size={24} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/post/${post._id}`)}
          className="ml-auto px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Eye size={16} />
          View Details
        </motion.button>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        {/* Budget */}
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={18} className="text-emerald-600" />
          <span className="text-xl font-bold text-emerald-600">
            PKR {post.budget?.toLocaleString() || "0"}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Budget</span>
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold text-gray-900 dark:text-white mb-2"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          {post.title || "Untitled Post"}
        </h3>
        
        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
          {post.description || "No description available."}
        </p>
        
        {/* Read More */}
        <button
          onClick={() => navigate(`/post/${post._id}`)}
          className="text-emerald-600 text-sm font-semibold mt-1 hover:underline"
        >
          Read more
        </button>
      </div>
    </motion.div>
  );
}



