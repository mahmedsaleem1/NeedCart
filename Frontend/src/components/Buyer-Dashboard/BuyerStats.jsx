import React from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  FileText,
  DollarSign,
  XCircle
} from "lucide-react";

export default function BuyerStats({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      gradient: "from-yellow-500 to-yellow-600",
      bgGradient: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
    },
    {
      title: "Delivered Orders",
      value: stats?.deliveredOrders || 0,
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
    },
    {
      title: "Total Spent",
      value: `$${(stats?.totalSpent || 0).toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
    },
    {
      title: "Active Posts",
      value: stats?.openPosts || 0,
      icon: FileText,
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20"
    },
    {
      title: "Confirmed Orders",
      value: stats?.confirmedOrders || 0,
      icon: TrendingUp,
      gradient: "from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
