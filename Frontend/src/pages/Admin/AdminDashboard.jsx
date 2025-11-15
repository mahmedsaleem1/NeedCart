import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  TrendingUp, 
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { auth } from '../../config/firebase/firebase';

const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border-l-4" style={{ borderColor: color }}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-opacity-10`} style={{ backgroundColor: color }}>
        <Icon size={24} style={{ color }} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp size={16} className="text-green-500" />
          <span className="text-green-600 font-semibold">{trend}</span>
        </div>
      )}
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (!auth.currentUser) {
        setError('Please login to continue');
        setLoading(false);
        return;
      }
      
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/admin/dashboard-overview`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOverview(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-600" size={24} />
          <div>
            <h3 className="text-red-800 font-semibold">Error Loading Dashboard</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!overview) return null;

  const { users, products, orders, revenue, payments, engagement } = overview;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-indigo-100">Complete overview of NeedCart platform</p>
      </div>

      {/* Users Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users size={28} />
          User Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Total Users"
            value={users.totalUsers.toLocaleString()}
            subtitle={`${users.totalBuyers} Buyers, ${users.totalSellers} Sellers`}
            color="#6366f1"
            trend={`+${users.newBuyersLast30Days + users.newSellersLast30Days} this month`}
          />
          <StatCard
            icon={UserCheck}
            title="Verified Sellers"
            value={users.verifiedSellers.toLocaleString()}
            subtitle={`${users.totalSellers} total sellers`}
            color="#10b981"
          />
          <StatCard
            icon={Clock}
            title="Pending Sellers"
            value={users.pendingSellers.toLocaleString()}
            subtitle="Awaiting verification"
            color="#f59e0b"
          />
          <StatCard
            icon={TrendingUp}
            title="New Users (30d)"
            value={(users.newBuyersLast30Days + users.newSellersLast30Days).toLocaleString()}
            subtitle={`${users.newBuyersLast30Days} buyers, ${users.newSellersLast30Days} sellers`}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Revenue Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign size={28} />
          Revenue & Payments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${revenue.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="All completed orders"
            color="#059669"
          />
          <StatCard
            icon={TrendingUp}
            title="Platform Fees"
            value={`$${revenue.totalPlatformFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Commission earned"
            color="#0891b2"
          />
          <StatCard
            icon={ShoppingBag}
            title="Average Order Value"
            value={`$${revenue.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Per transaction"
            color="#7c3aed"
          />
          <StatCard
            icon={CheckCircle}
            title="Released Payments"
            value={payments.releasedPayments.toLocaleString()}
            subtitle={`${payments.pendingPayments} pending`}
            color="#22c55e"
          />
        </div>
      </div>

      {/* Products & Orders Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package size={28} />
          Products & Orders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Package}
            title="Total Products"
            value={products.totalProducts.toLocaleString()}
            subtitle={`+${products.newProductsLast30Days} this month`}
            color="#ec4899"
          />
          <StatCard
            icon={Package}
            title="Total Posts"
            value={products.totalPosts.toLocaleString()}
            subtitle="Buyer requests"
            color="#f97316"
          />
          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value={orders.totalOrders.toLocaleString()}
            subtitle={`+${orders.newOrdersLast30Days} this month`}
            color="#3b82f6"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Reviews"
            value={engagement.totalReviews.toLocaleString()}
            subtitle="Customer feedback"
            color="#a855f7"
          />
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Order Status Breakdown</h3>
          <div className="space-y-3">
            {orders.statusBreakdown.map((status) => {
              const percentage = (status.count / orders.totalOrders) * 100;
              return (
                <div key={status._id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {status._id || 'Unknown'}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {status.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Product Categories</h3>
          <div className="space-y-3">
            {products.categoryDistribution.slice(0, 6).map((category) => {
              const percentage = (category.count / products.totalProducts) * 100;
              return (
                <div key={category._id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category._id || 'Uncategorized'}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {category.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/admin/sellers'}
            className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold py-4 px-6 rounded-lg transition-colors border-2 border-orange-200"
          >
            <Clock className="mx-auto mb-2" size={24} />
            {users.pendingSellers} Pending Sellers
          </button>
          <button
            onClick={() => window.location.href = '/admin/payments'}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-4 px-6 rounded-lg transition-colors border-2 border-blue-200"
          >
            <DollarSign className="mx-auto mb-2" size={24} />
            {payments.pendingPayments} Pending Payments
          </button>
          <button
            onClick={() => window.location.href = '/admin/orders'}
            className="bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-4 px-6 rounded-lg transition-colors border-2 border-green-200"
          >
            <ShoppingBag className="mx-auto mb-2" size={24} />
            {orders.newOrdersLast30Days} New Orders
          </button>
          <button
            onClick={() => window.location.href = '/admin/analytics'}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-4 px-6 rounded-lg transition-colors border-2 border-purple-200"
          >
            <TrendingUp className="mx-auto mb-2" size={24} />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
