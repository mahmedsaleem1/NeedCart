import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import axios from 'axios';
import { auth } from '../../config/firebase/firebase';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const [revenueData, setRevenueData] = useState({ revenueByPeriod: [], platformFeesOverTime: [] });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // day, week, month, year

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      if (!auth.currentUser) {
        setError('Please login to continue');
        setLoading(false);
        return;
      }
      
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/admin/revenue-analytics?period=${period}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setRevenueData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `$${value?.toFixed(2)}`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalRevenue = revenueData.revenueByPeriod.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalFees = revenueData.platformFeesOverTime.reduce((sum, item) => sum + item.totalFees, 0);
  const totalOrders = revenueData.revenueByPeriod.reduce((sum, item) => sum + item.orderCount, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <TrendingUp size={32} />
          Revenue Analytics
        </h1>
        <p className="text-purple-100">Detailed revenue and performance metrics</p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="text-gray-600" size={20} />
          <h3 className="font-semibold text-gray-800">Select Period</h3>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors capitalize ${
                period === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p === 'day' ? 'Last 7 Days' : 
               p === 'week' ? 'Last 30 Days' : 
               p === 'month' ? 'Last 3 Months' : 
               'Last Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-purple-600">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {totalOrders} orders
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm mb-1">Platform Fees</div>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(totalFees)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Commission earned
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm mb-1">Average Order Value</div>
          <div className="text-3xl font-bold text-emerald-600">
            {formatCurrency(avgOrderValue)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Per transaction
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm mb-1">Net Revenue</div>
          <div className="text-3xl font-bold text-indigo-600">
            {formatCurrency(totalRevenue - totalFees)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            After platform fees
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
        </div>
      ) : (
        <>
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <DollarSign size={24} className="text-purple-600" />
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueData.revenueByPeriod}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="_id" 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stroke="#9333ea" 
                  strokeWidth={3}
                  name="Total Revenue"
                  dot={{ fill: '#9333ea', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="averageOrderValue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Avg Order Value"
                  dot={{ fill: '#3b82f6', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order Count Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData.revenueByPeriod}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="_id" 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="orderCount" 
                  fill="#8b5cf6" 
                  name="Number of Orders"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Fees Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Platform Fees Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData.platformFeesOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="_id" 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="totalFees" 
                  fill="#10b981" 
                  name="Platform Fees"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Detailed Breakdown</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Period</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Orders</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Revenue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Avg Order Value</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Platform Fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {revenueData.revenueByPeriod.map((item, index) => {
                  const fees = revenueData.platformFeesOverTime[index]?.totalFees || 0;
                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{item._id}</td>
                      <td className="px-6 py-4 text-gray-600">{item.orderCount}</td>
                      <td className="px-6 py-4 font-semibold text-purple-600">
                        {formatCurrency(item.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatCurrency(item.averageOrderValue)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        {formatCurrency(fees)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
