import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Clock, CheckCircle, Loader2 } from "lucide-react";
import { auth } from "../../config/firebase/firebase";

export default function DashboardStats() {
  const [heldAmount, setHeldAmount] = useState(0);
  const [releasedAmount, setReleasedAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAmounts();
  }, []);

  const fetchAmounts = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      const [heldRes, releasedRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_URL}/seller-dashboard/get-total-held-amount`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_URL}/seller-dashboard/get-total-released-amount`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const heldData = await heldRes.json();
      const releasedData = await releasedRes.json();

      if (heldRes.ok) setHeldAmount(heldData.data || 0);
      if (releasedRes.ok) setReleasedAmount(releasedData.data || 0);
      
      setError("");
    } catch (err) {
      console.error("Error fetching amounts:", err);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Held Amount",
      value: `$${heldAmount.toFixed(2)}`,
      icon: Clock,
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Released Amount",
      value: `$${releasedAmount.toFixed(2)}`,
      icon: CheckCircle,
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Total Earnings",
      value: `$${(heldAmount + releasedAmount).toFixed(2)}`,
      icon: TrendingUp,
      color: "from-emerald-600 to-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-500"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.iconColor} bg-white dark:bg-gray-800 shadow-md`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className={`p-2 rounded-full bg-gradient-to-r ${stat.color}`}>
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
            {stat.title}
          </h3>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white" style={{ fontFamily: "'Lemon Milk', sans-serif" }}>
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
