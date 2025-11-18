import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Plus, Filter, Search, ShoppingBag } from "lucide-react";
import Navbar from "../components/misc/Navbar";
import Footer from "../components/misc/Footer";
import ProductCard from "../components/Product/ProductCard";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all"); // all, in-stock, out-of-stock

  const { role, isAuthenticated } = useSelector((state) => state.auth);

  const categories = [
    "all",
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Beauty",
    "Sports",
    "Toys",
    "Others",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_URL}/product/all`
      );
      const result = await response.json();

      if (response.ok) {
        setProducts(result.data || []);
      } else {
        // Parse backend error message
        let errorMessage = "Failed to fetch products.";
        if (result.message) {
          errorMessage = result.message;
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError("Unable to connect to server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    const matchesStock =
      filterStock === "all" ||
      (filterStock === "in-stock" && product.availableStock > 0) ||
      (filterStock === "out-of-stock" && product.availableStock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1
              className="text-5xl md:text-6xl font-extrabold text-emerald-600 mb-4"
              style={{ fontFamily: "'Lemon Milk', sans-serif" }}
            >
              <ShoppingBag className="inline mb-2 mr-2" size={48} />
              Browse Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Discover amazing products from verified sellers
            </p>
          </motion.div>

          {/* Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="w-full">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>

              {/* Filters and Actions */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                  <Filter size={20} className="text-gray-600 dark:text-gray-300" />

                  {/* Category Filter */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>

                  {/* Stock Filter */}
                  <select
                    value={filterStock}
                    onChange={(e) => setFilterStock(e.target.value)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 transition-all"
                  >
                    <option value="all">All Stock</option>
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full md:w-auto">
                  {/* Wishlist Button (Buyers Only) */}
                  {isAuthenticated && role === "buyer" && (
                    <motion.button
                      onClick={() => navigate("/wishlist")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 md:flex-none bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      ❤️ Wishlist
                    </motion.button>
                  )}

                  {/* Add Product Button (Sellers Only) */}
                  {isAuthenticated && role === "seller" && (
                    <>
                      <motion.button
                        onClick={() => navigate("/my-products")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 md:flex-none bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        My Products
                      </motion.button>
                      <motion.button
                        onClick={() => navigate("/add-product")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 md:flex-none bg-gradient-to-r from-rose-600 to-rose-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <Plus size={20} />
                        Add Product
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Loading products...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-xl mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-500 dark:text-gray-400 text-xl">
                {searchTerm || filterCategory !== "all" || filterStock !== "all"
                  ? "No products found matching your criteria"
                  : "No products available yet"}
              </p>
              {isAuthenticated && role === "seller" && (
                <motion.button
                  onClick={() => navigate("/add-product")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Add First Product
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
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



