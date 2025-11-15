import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Package,
  DollarSign,
  Star,
  Truck,
  CreditCard,
  MapPin,
  Plus,
  Minus,
  ArrowLeft,
} from "lucide-react";
import { auth } from "../../config/firebase/firebase";
import Navbar from "../misc/Navbar";
import Footer from "../misc/Footer";
import ReviewCard from "./ReviewCard";
import CreateReview from "./CreateReview";
import PaymentRedirect from "../Post/PaymentRedirect";

export default function Product() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const { user, isAuthenticated, role } = useSelector((state) => state.auth);

  // Check for payment status in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get("payment");

    if (payment) {
      setPaymentStatus(payment);
      window.history.replaceState({}, "", `/product/${productId}`);
      setTimeout(() => setPaymentStatus(null), 5000);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductData();
    if (isAuthenticated && role === "buyer") {
      checkWishlistStatus();
    }
  }, [productId, isAuthenticated, role]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : "";

      // Fetch product details
      const productRes = await fetch(
        `${import.meta.env.VITE_URL}/product/getOne/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const productData = await productRes.json();

      if (!productRes.ok) {
        throw new Error(productData.message || "Failed to fetch product");
      }
      
      setProduct(productData.data);

      // Fetch reviews - only if product exists
      try {
        const reviewsRes = await fetch(
          `${import.meta.env.VITE_URL}/review/get/${productId}`
        );
        
        // Check if response is JSON before parsing
        const contentType = reviewsRes.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          // Backend returned HTML error page (404/500)
          console.warn("Review endpoint returned non-JSON response");
          setReviews([]);
        } else {
          const reviewsData = await reviewsRes.json();
          // Handle both success and 404 (no reviews) cases
          if (reviewsRes.ok) {
            const reviewsArray = Array.isArray(reviewsData.data)
              ? reviewsData.data
              : [];
            setReviews(reviewsArray);
          } else if (reviewsRes.status === 404) {
            // Product has no reviews yet - this is not an error
            setReviews([]);
          }
        }
      } catch (reviewErr) {
        // If review fetch fails, just set empty reviews array
        console.warn("Could not fetch reviews:", reviewErr);
        setReviews([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      // Check if user is authenticated first
      if (!auth.currentUser) {
        return;
      }
      
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_URL}/wishlist/get`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        const wishlistItems = Array.isArray(data.data) ? data.data : [];
        const isInList = wishlistItems.some(
          (item) => item.productId?._id === productId
        );
        setIsInWishlist(isInList);
      }
    } catch (err) {
      console.error("Failed to check wishlist status:", err);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (role !== "buyer") {
      alert("Only buyers can add products to wishlist");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const endpoint = isInWishlist ? "delete" : "add";

      const response = await fetch(
        `${import.meta.env.VITE_URL}/wishlist/${endpoint}/${productId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setIsInWishlist(!isInWishlist);
      } else {
        // Parse backend error message for user-friendly display
        let errorMessage = "Failed to update wishlist.";
        
        if (data.message) {
          if (data.message.includes("not found") || data.message.includes("does not exist")) {
            errorMessage = "Product not found.";
          } else if (data.message.includes("logged in") || data.message.includes("Buyer")) {
            errorMessage = "Please log in as a buyer to manage wishlist.";
          } else if (data.message.includes("already")) {
            errorMessage = "Product is already in your wishlist.";
          } else {
            errorMessage = data.message;
          }
        }
        
        alert(errorMessage);
      }
    } catch (err) {
      alert("Failed to update wishlist. Please try again.");
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (role !== "buyer") {
      alert("Only buyers can purchase products");
      return;
    }

    if (product.availableStock < quantity) {
      alert("Not enough stock available");
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePurchase = async () => {
    if (!address.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    try {
      setProcessingPayment(true);
      const token = await auth.currentUser.getIdToken();
      const totalPrice = product.price * quantity;

      const endpoint =
        paymentMethod === "cod"
          ? `/item-cod/buy/${productId}`
          : `/item/buy/${productId}`;

      const response = await fetch(`${import.meta.env.VITE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address,
          quantity,
          totalPrice,
        }),
      });

      const data = await response.json();
      console.log("bharwary ", data);
      

      if (!response.ok) {
        // Parse backend error message for user-friendly display
        let errorMessage = "Purchase failed. Please try again.";
        
        if (data.message) {
          // Handle specific error cases
          if (data.message.includes("not found") || data.message.includes("does not exist")) {
            errorMessage = "This product is no longer available.";
          } else if (data.message.includes("stock") || data.message.includes("available")) {
            errorMessage = "Not enough stock available. Please reduce quantity.";
          } else if (data.message.includes("seller")) {
            errorMessage = "Seller account issue. Please contact support.";
          } else if (data.message.includes("logged in") || data.message.includes("authentication")) {
            errorMessage = "Please log in to continue.";
          } else if (data.message.includes("buyer")) {
            errorMessage = "Only buyers can purchase products.";
          } else {
            errorMessage = data.message;
          }
        }
        
        throw new Error(errorMessage);
      }

      if (paymentMethod === "stripe") {
        // Redirect to Stripe checkout
        const checkoutUrl = data.data?.url || data.message?.url || data.data?.data?.url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          throw new Error("Payment session could not be created. Please try again.");
        }
      } else {
        // COD success
        alert("Order placed successfully with Cash on Delivery!");
        setShowPaymentModal(false);
        navigate("/");
      }
    } catch (err) {
      alert(err.message || "An unexpected error occurred. Please try again.");
      setProcessingPayment(false);
    }
  };

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter((r) => r._id !== reviewId));
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3772ff] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error || "Product not found"}</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-[#3772ff] text-white rounded-full hover:bg-[#2759dd] transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 px-4">
        {/* Payment Status Messages */}
        {paymentStatus && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl ${
              paymentStatus === "success"
                ? "bg-green-500"
                : "bg-red-500"
            } text-white font-semibold`}
          >
            {paymentStatus === "success"
              ? "✅ Payment successful! Your order has been placed."
              : "❌ Payment was cancelled or failed."}
          </motion.div>
        )}

        {processingPayment && <PaymentRedirect />}

        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/products")}
            className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#3772ff] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Products
          </motion.button>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <span
                  className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold ${
                    product.availableStock > 0
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {product.availableStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
                <span className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold bg-[#3772ff] text-white">
                  {product.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <h1
                    className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4"
                    style={{ fontFamily: "'Lemon Milk', sans-serif" }}
                  >
                    {product.title}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 fill-yellow-400" size={20} />
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {averageRating}
                      </span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({reviews.length} reviews)
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Price
                    </p>
                    <p className="text-4xl font-extrabold text-[#3772ff]">
                      PKR {product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-6">
                    <Package size={20} />
                    <span>
                      {product.availableStock} units available
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  {isAuthenticated && role === "buyer" && product.availableStock > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Quantity
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <Minus size={20} />
                        </button>
                        <span className="text-2xl font-bold">{quantity}</span>
                        <button
                          onClick={() =>
                            setQuantity(
                              Math.min(product.availableStock, quantity + 1)
                            )
                          }
                          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isAuthenticated && role === "buyer" && (
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      disabled={product.availableStock === 0}
                      className="flex-1 bg-gradient-to-r from-[#3772ff] to-[#5c8cff] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Buy Now
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleWishlistToggle}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isInWishlist
                          ? "bg-red-500 border-red-500 text-white"
                          : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-500 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={24}
                        className={isInWishlist ? "fill-white" : ""}
                      />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
          >
            <h2
              className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6"
              style={{ fontFamily: "'Lemon Milk', sans-serif" }}
            >
              Customer Reviews
            </h2>

            {/* Add Review */}
            {isAuthenticated && role === "buyer" && (
              <div className="mb-8">
                <CreateReview
                  productId={productId}
                  onReviewAdded={handleReviewAdded}
                />
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    onDelete={handleReviewDeleted}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full"
          >
            <h3
              className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
              style={{ fontFamily: "'Lemon Milk', sans-serif" }}
            >
              Complete Your Purchase
            </h3>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Product:</span>
                <span className="font-semibold">{product.title}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Quantity:</span>
                <span className="font-semibold">{quantity}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                <span className="text-gray-900 dark:text-white font-bold">Total:</span>
                <span className="text-[#3772ff] font-bold text-xl">
                  PKR {(product.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete delivery address"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#3772ff] dark:bg-gray-700 dark:text-white resize-none"
                rows="3"
                required
              />
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#3772ff] transition-colors">
                  <input
                    type="radio"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard size={20} className="mr-2 text-[#3772ff]" />
                  <span className="font-semibold">Card Payment (Stripe)</span>
                </label>
                <label className="flex items-center p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#3772ff] transition-colors">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Truck size={20} className="mr-2 text-[#3772ff]" />
                  <span className="font-semibold">Cash on Delivery</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={processingPayment}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#3772ff] to-[#5c8cff] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {processingPayment ? "Processing..." : "Confirm Purchase"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  );
}



