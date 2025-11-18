import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Building2, CheckCircle, Loader2, AlertCircle, Lock } from "lucide-react";
import { auth } from "../../config/firebase/firebase";

const BANK_OPTIONS = [
  'EasyPaisa',
  'JazzCash',
  'Meezan Bank',
  'Muslim Commercial Bank',
  'Bank Alfalah',
  'Faysal Bank',
  'Standard Chartered',
  'Allied Bank',
  'Bank of Punjab',
  'Askari Bank',
  'Habib Bank Limited',
  'National Bank of Pakistan',
  'Soneri Bank',
  'Silk Bank',
  'Summit Bank',
  'United Bank Limited',
  'Zarai Taraqiati Bank'
];

export default function PaymentDetails() {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bankName || !accountNumber) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_URL}/seller-dashboard/provide-payment-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            bankName,
            accountNumber
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update payment details");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (err) {
      console.error("Error updating payment details:", err);
      setError(err.message || "Failed to update payment details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
          <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Lemon Milk', sans-serif" }}>
            Payment Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Set up your bank account for receiving payments
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
      >
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-green-700 dark:text-green-400 font-semibold">
              Payment details updated successfully!
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div className="text-sm">
            <p className="text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
              Secure Information
            </p>
            <p className="text-emerald-600 dark:text-emerald-500">
              Your payment details are securely stored and will be used to transfer released payments to your account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Bank Name
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
              disabled={loading}
            >
              <option value="">Select your bank</option>
              {BANK_OPTIONS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your account number"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontFamily: "'Lemon Milk', sans-serif" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Save Payment Details
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By providing your payment details, you agree to our terms and conditions for seller payouts.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
