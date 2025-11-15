import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Trash2, User } from "lucide-react";
import { auth } from "../../config/firebase/firebase";
import { useSelector } from "react-redux";

export default function ReviewCard({ review, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setDeleting(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_URL}/review/delete/${review._id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      if (onDelete) {
        onDelete(review._id);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Check if current user is the author
  const isAuthor =
    user && review.buyerId?.firebaseUID === auth.currentUser?.uid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3772ff] to-[#5c8cff] rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {review.buyerId?.name || "Anonymous"}
            </p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {isAuthor && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
          </motion.button>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {review.comment}
      </p>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        {new Date(review.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </motion.div>
  );
}



