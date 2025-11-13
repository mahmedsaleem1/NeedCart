import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, DollarSign, Package, Eye, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.title || "Product Image"}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
        />
        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            product.availableStock > 0
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {product.availableStock > 0 ? "In Stock" : "Out of Stock"}
        </span>
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#3772ff]/90 text-white backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 line-clamp-1"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          {product.title || "Untitled Product"}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description || "No description available."}
        </p>

        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Price */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <DollarSign size={12} />
              Price
            </p>
            <p className="text-lg font-bold text-[#3772ff]">
              PKR {product.price?.toLocaleString() || "0"}
            </p>
          </div>

          {/* View Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#3772ff] to-[#5c8cff] text-white rounded-full hover:shadow-lg hover:shadow-blue-500/20/30/30 transition-all flex items-center gap-2"
          >
            <Eye size={16} />
            View
          </motion.button>
        </div>

        {/* Stock Info */}
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <Package size={12} />
          <span>
            {product.availableStock > 0
              ? `${product.availableStock} available`
              : "Out of stock"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}



