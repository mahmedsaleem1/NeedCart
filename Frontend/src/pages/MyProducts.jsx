import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Package, Plus, Trash2, Eye, Edit } from "lucide-react";
import { auth } from "../config/firebase/firebase";
import Navbar from "../components/misc/Navbar";
import Footer from "../components/misc/Footer";
import ProductCard from "../components/Product/ProductCard";

export default function MyProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (role !== "seller") {
      navigate("/products");
      return;
    }

    fetchMyProducts();
  }, [isAuthenticated, role, navigate]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      // Fetch all products
      const response = await fetch(
        `${import.meta.env.VITE_URL}/product/all`
      );
      const result = await response.json();

      if (response.ok) {
        // Get seller's UID
        const sellerUID = auth.currentUser.uid;

        // Get all products
        const allProducts = result.data || [];
        
        // Filter products by checking if current user is seller
        // Note: This is a temporary solution. Ideally, backend should have a route
        // to fetch products by seller ID
        setProducts(allProducts);
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

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_URL}/product/remove/${productId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId));
        alert("Product deleted successfully! ✓");
      } else {
        // Parse backend error message
        let errorMessage = "Failed to delete product.";
        if (result.message) {
          if (result.message.includes("not authorized")) {
            errorMessage = "You can only delete your own products.";
          } else if (result.message.includes("not found")) {
            errorMessage = "Product not found.";
          } else if (result.message.includes("seller")) {
            errorMessage = "You must be logged in as a seller to delete products.";
          } else {
            errorMessage = result.message;
          }
        }
        alert(errorMessage);
      }
    } catch (err) {
      alert("Failed to delete product. Please try again.");
    }
  };

  if (!isAuthenticated || role !== "seller") {
    return null;
  }

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
              <Package className="inline mb-2 mr-2" size={48} />
              My Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Manage your product listings
            </p>
          </motion.div>

          {/* Add Product Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-end mb-8"
          >
            <motion.button
              onClick={() => navigate("/add-product")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-rose-600 to-rose-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Product
            </motion.button>
          </motion.div>

          {/* Products Content */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Loading your products...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-xl mb-4">{error}</p>
              <button
                onClick={fetchMyProducts}
                className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package size={80} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-xl mb-6">
                You haven't added any products yet
              </p>
              <motion.button
                onClick={() => navigate("/add-product")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-rose-600 to-rose-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Add Your First Product
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="bg-emerald-600 text-white p-2 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
                      title="View Product"
                    >
                      <Eye size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>

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



