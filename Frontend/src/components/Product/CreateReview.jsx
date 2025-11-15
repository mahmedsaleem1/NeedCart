import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import { auth } from "../../config/firebase/firebase";

export default function CreateReview({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError("Please enter a review comment");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_URL}/review/add/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Parse backend error message for user-friendly display
        let errorMessage = "Failed to add review. Please try again.";
        
        if (data.message) {
          // Handle specific error cases
          if (data.message.includes("not purchased") || data.message.includes("have not purchased")) {
            errorMessage = "You can only review products you have purchased.";
          } else if (data.message.includes("delivered")) {
            errorMessage = "You can only review products that have been delivered to you.";
          } else if (data.message.includes("not found") || data.message.includes("does not exist")) {
            errorMessage = "Product not found.";
          } else if (data.message.includes("logged in") || data.message.includes("Buyer")) {
            errorMessage = "Please log in as a buyer to write reviews.";
          } else if (data.message.includes("required") || data.message.includes("Fields")) {
            errorMessage = "Please provide both rating and comment.";
          } else {
            errorMessage = data.message;
          }
        }
        
        throw new Error(errorMessage);
      }

      setSuccess("Review added successfully!");
      setComment("");
      setRating(5);
      if (onReviewAdded) {
        onReviewAdded(data.data);
      }
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Write a Review
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  size={32}
                  className={`${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  } transition-colors`}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#3772ff] dark:bg-gray-800 dark:text-white resize-none"
            rows="4"
            required
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#3772ff] to-[#5c8cff] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            "Submitting..."
          ) : (
            <>
              <Send size={18} />
              Submit Review
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}



