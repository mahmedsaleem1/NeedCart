import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  LayoutDashboard, 
  Package, 
  Clock, 
  CheckCircle, 
  CreditCard, 
  TrendingUp,
  ShoppingBag,
  Plus,
  ArrowLeft
} from "lucide-react";
import Navbar from "../components/misc/Navbar";
import Footer from "../components/misc/Footer";
import DashboardStats from "../components/Seller-Dashboard/DashboardStats";
import HeldPayments from "../components/Seller-Dashboard/HeldPayments";
import ReleasedPayments from "../components/Seller-Dashboard/ReleasedPayments";
import OrderManagement from "../components/Seller-Dashboard/OrderManagement";
import PaymentDetails from "../components/Seller-Dashboard/PaymentDetails";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not authenticated or not a seller
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (role !== "seller") {
      navigate("/");
    }
  }, [isAuthenticated, role, navigate]);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: Package },
    { id: "held", label: "Held Payments", icon: Clock },
    { id: "released", label: "Released Payments", icon: CheckCircle },
    { id: "payment-details", label: "Payment Details", icon: CreditCard }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors mb-4"
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
                  Seller Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome back, {user?.displayName || "Seller"}! Manage your orders and earnings.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/my-products")}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-500 font-semibold rounded-xl border-2 border-emerald-600 dark:border-emerald-500 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 transition-all duration-300 shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  My Products
                </button>

                <button
                  onClick={() => navigate("/add-product")}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
              </div>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 mb-8 overflow-x-auto"
          >
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-8">
                <DashboardStats />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Quick Stats
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Track your performance and manage your seller account efficiently.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          View Active Orders →
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab("held")}
                        className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Check Held Payments →
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl p-6 shadow-xl text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Package className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold">Getting Started</h3>
                    </div>
                    <p className="text-white/90 text-sm mb-4">
                      New to selling on NeedCart? Here's what you need to know:
                    </p>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Payments are held in escrow until delivery confirmation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Mark orders as delivered after successful delivery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Admin reviews and releases payments to your account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Set up payment details to receive released funds</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && <OrderManagement />}
            {activeTab === "held" && <HeldPayments />}
            {activeTab === "released" && <ReleasedPayments />}
            {activeTab === "payment-details" && <PaymentDetails />}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
