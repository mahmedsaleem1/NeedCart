import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  LayoutDashboard, 
  Package, 
  FileText,
  Plus,
  ArrowLeft,
  ShoppingBag,
  Filter
} from "lucide-react";
import Navbar from "../components/misc/Navbar";
import Footer from "../components/misc/Footer";
import BuyerStats from "../components/Buyer-Dashboard/BuyerStats";
import OrdersList from "../components/Buyer-Dashboard/OrdersList";
import PostsManagement from "../components/Buyer-Dashboard/PostsManagement";
import axios from "axios";
import { auth } from "../config/firebase/firebase";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("all");
  const [authReady, setAuthReady] = useState(false);

  // Wait for Firebase auth to be ready
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Redirect if not authenticated or not a buyer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (role !== "buyer") {
      navigate("/");
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        setLoading(false);
        return;
      }
      const token = await auth.currentUser.getIdToken();
      
      // Fetch stats
      const statsRes = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(statsRes.data.data);

      // Fetch orders
      const ordersRes = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(Array.isArray(ordersRes.data.data) ? ordersRes.data.data : []);

      // Fetch posts
      const postsRes = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(Array.isArray(postsRes.data.data) ? postsRes.data.data : []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set empty arrays on error to prevent undefined issues
      setOrders([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && role === "buyer" && authReady && auth.currentUser) {
      fetchDashboardData();
    }
  }, [isAuthenticated, role, authReady, fetchDashboardData]);

  const fetchOrdersByStatus = async (status) => {
    try {
      setLoading(true);
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        return;
      }
      const token = await auth.currentUser.getIdToken();
      const url = status === "all" 
        ? `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/orders`
        : `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/orders?status=${status}`;
      
      const ordersRes = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(Array.isArray(ordersRes.data.data) ? ordersRes.data.data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderFilterChange = (filter) => {
    setOrderFilter(filter);
    fetchOrdersByStatus(filter);
  };

  const handleUpdatePostStatus = async (postId, newStatus) => {
    try {
      if (!auth.currentUser) {
        alert('Please log in to update post status');
        return;
      }
      const token = await auth.currentUser.getIdToken();
      await axios.patch(
        `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/posts/${postId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh posts
      const postsRes = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(Array.isArray(postsRes.data.data) ? postsRes.data.data : []);
      
      // Refresh stats
      const statsRes = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(statsRes.data.data);
    } catch (error) {
      console.error("Error updating post status:", error);
      alert("Failed to update post status");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      if (!auth.currentUser) {
        alert('Please log in to delete post');
        return;
      }
      const token = await auth.currentUser.getIdToken();
      await axios.delete(
        `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/posts/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh posts
      const postsRes = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(Array.isArray(postsRes.data.data) ? postsRes.data.data : []);
      
      // Refresh stats
      const statsRes = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/buyer-dashboard/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(statsRes.data.data);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "posts", label: "My Posts", icon: FileText }
  ];

  const orderFilters = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#3772ff] dark:hover:text-[#5c8cff] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 
                  className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "'Lemon Milk', sans-serif" }}
                >
                  Buyer Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome back, {user?.displayName || "Buyer"}! Manage your orders and posts.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/products")}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-[#3772ff] dark:text-[#5c8cff] font-semibold rounded-xl border-2 border-[#3772ff] dark:border-[#5c8cff] hover:bg-[#3772ff] hover:text-white dark:hover:bg-[#5c8cff] transition-all duration-300 shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Browse Products
                </button>

                <button
                  onClick={() => navigate("/create-post")}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3772ff] to-[#2759dd] text-white font-semibold rounded-xl hover:from-[#2759dd] hover:to-[#1a4bcc] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Create Post
                </button>
              </div>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 inline-flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#3772ff] to-[#2759dd] text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div>
                <BuyerStats stats={stats} loading={loading} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Orders */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Recent Orders
                      </h2>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-[#3772ff] hover:text-[#2759dd] font-semibold text-sm"
                      >
                        View All
                      </button>
                    </div>
                    <OrdersList 
                      orders={orders?.slice(0, 3) || []} 
                      loading={loading}
                    />
                  </div>

                  {/* Recent Posts */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Recent Posts
                      </h2>
                      <button
                        onClick={() => setActiveTab("posts")}
                        className="text-[#3772ff] hover:text-[#2759dd] font-semibold text-sm"
                      >
                        View All
                      </button>
                    </div>
                    <PostsManagement 
                      posts={posts?.slice(0, 2) || []} 
                      loading={loading}
                      onUpdateStatus={handleUpdatePostStatus}
                      onDelete={handleDeletePost}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Orders
                  </h2>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <select
                      value={orderFilter}
                      onChange={(e) => handleOrderFilterChange(e.target.value)}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#3772ff] focus:border-transparent"
                    >
                      {orderFilters.map((filter) => (
                        <option key={filter.id} value={filter.id}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <OrdersList orders={orders} loading={loading} />
              </div>
            )}

            {activeTab === "posts" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Posts
                  </h2>
                  <button
                    onClick={() => navigate("/create-post")}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3772ff] to-[#2759dd] text-white font-semibold rounded-lg hover:from-[#2759dd] hover:to-[#1a4bcc] transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    New Post
                  </button>
                </div>
                <PostsManagement 
                  posts={posts} 
                  loading={loading}
                  onUpdateStatus={handleUpdatePostStatus}
                  onDelete={handleDeletePost}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
