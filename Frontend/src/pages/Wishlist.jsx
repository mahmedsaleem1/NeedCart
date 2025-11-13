import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { auth } from "../config/firebase/firebase";
import Navbar from "../components/misc/Navbar";
import Footer from "../components/misc/Footer";
import ProductCard from "../components/Product/ProductCard";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (role !== "buyer") {
      navigate("/products");
      return;
    }

    fetchWishlist();
  }, [isAuthenticated, role, navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_URL}/api/v1/wishlist/get`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setWishlist(result.data || []);
      } else {
        // Parse backend error message
        let errorMessage = "Failed to fetch wishlist.";
        if (result.message) {
          if (result.message.includes("logged in") || result.message.includes("buyer")) {
            errorMessage = "Please log in as a buyer to view wishlist.";
          } else {
            errorMessage = result.message;
          }
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError("Unable to connect to server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_URL}/api/v1/wishlist/delete/${productId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setWishlist(wishlist.filter((item) => item.productId._id !== productId));
      } else {
        // Parse backend error message
        let errorMessage = "Failed to remove from wishlist.";
        if (result.message) {
          if (result.message.includes("not found")) {
            errorMessage = "Item not found in wishlist.";
          } else {
            errorMessage = result.message;
          }
        }
        alert(errorMessage);
      }
    } catch (err) {
      alert("Failed to remove from wishlist. Please try again.");
    }
  };

  if (!isAuthenticated || role !== "buyer") {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1
              className="text-5xl md:text-6xl font-extrabold text-[#3772ff] mb-4"
              style={{ fontFamily: "'Lemon Milk', sans-serif" }}
            >
              <Heart className="inline mb-2 mr-2 fill-red-500 text-red-500" size={48} />
              My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Your favorite products saved for later
            </p>
          </motion.div>

          {/* Wishlist Content */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3772ff] mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Loading wishlist...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-xl mb-4">{error}</p>
              <button
                onClick={fetchWishlist}
                className="px-6 py-2 bg-[#3772ff] text-white rounded-full hover:bg-[#2759dd] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Heart size={80} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-xl mb-6">
                Your wishlist is empty
              </p>
              <motion.button
                onClick={() => navigate("/products")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#3772ff] to-[#5c8cff] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                <ShoppingBag size={20} />
                Browse Products
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {wishlist.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveFromWishlist(item.productId._id)}
                    className="absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </motion.button>

                  <ProductCard product={item.productId} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}



