import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle, Clock, AlertCircle, Eye, X } from 'lucide-react';
import axios from 'axios';
import { auth } from '../../config/firebase/firebase';

const PaymentManagement = () => {
  const [escrowPayments, setEscrowPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, held, released
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      if (!auth.currentUser) {
        setError('Please login to continue');
        setLoading(false);
        return;
      }
      
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/admin/get-order-payment-status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setEscrowPayments(response.data.data.payments || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleReleasePayment = async (escrowId) => {
    if (!confirm('Are you sure you want to release this payment to the seller?')) {
      return;
    }

    try {
      if (!auth.currentUser) {
        alert('Please login to continue');
        return;
      }
      
      const token = await auth.currentUser.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/admin/release-payment/${escrowId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Payment released successfully!');
        setShowModal(false);
        fetchPayments();
      }
    } catch (error) {
      console.error('Error releasing payment:', error);
      alert(error.response?.data?.message || 'Failed to release payment');
    }
  };

  const getStatusColor = (status) => {
    return status === 'released' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-orange-100 text-orange-700';
  };

  const getStatusIcon = (status) => {
    return status === 'released' 
      ? <CheckCircle size={16} /> 
      : <Clock size={16} />;
  };

  const filteredPayments = escrowPayments.filter(payment => {
    if (filter === 'all') return true;
    return payment.escrowStatus === filter;
  });

  const PaymentDetailsModal = ({ payment, onClose }) => {
    if (!payment) return null;

    const order = payment.orderDetails;
    const sellerBank = payment.sellerBankDetails;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">Payment Details</h2>
                <p className="text-green-100">Escrow ID: {payment._id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200"
                title="Close"
              >
                <X size={24} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Escrow Status:</span>
              <span className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${getStatusColor(payment.escrowStatus)}`}>
                {getStatusIcon(payment.escrowStatus)}
                {payment.escrowStatus === 'released' ? 'Released' : 'Held'}
              </span>
            </div>

            {/* Payment Breakdown */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3">Payment Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-gray-900">
                    ${payment.totalAmount?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee (10% + Stripe):</span>
                  <span className="font-semibold text-orange-600">
                    -${payment.platformFee?.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2"></div>
                <div className="flex justify-between text-xl">
                  <span className="text-gray-800 font-semibold">Net to Seller:</span>
                  <span className="font-bold text-green-600">
                    ${payment.netAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Information */}
            {order && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-3">Related Order</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item:</span>
                    <span className="font-medium">{order.itemName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{order.quantity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Status:</span>
                    <span className="font-medium capitalize">{order.status || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Address:</span>
                    <span className="font-medium text-sm">{order.address || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{'Stripe'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Seller Bank Details */}
            {sellerBank && (
              <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200">
                <h3 className="font-semibold text-gray-800 mb-3">Seller Bank Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seller Email:</span>
                    <span className="font-medium">{sellerBank.sellerEmail || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="font-semibold text-emerald-700">{sellerBank.bankName || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-mono font-semibold text-emerald-700">{sellerBank.accountNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verified:</span>
                    <span className={`font-semibold ${sellerBank.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {sellerBank.isVerified ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3">Timeline</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Escrow Created:</span>
                  <span className="font-medium">
                    {new Date(payment.createdAt).toLocaleString()}
                  </span>
                </div>
                {payment.releasedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Released At:</span>
                    <span className="font-medium text-green-600">
                      {new Date(payment.releasedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            {payment.escrowStatus === 'held' && order?.status === 'delivered' && (
              <button
                onClick={() => handleReleasePayment(payment._id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Release Payment to Seller
              </button>
            )}

            {payment.escrowStatus === 'held' && order?.status !== 'delivered' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle size={20} />
                  <p className="text-sm">
                    Payment can only be released after order is marked as delivered.
                    Current status: <strong className="capitalize">{order?.status || 'unknown'}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const stats = {
    total: escrowPayments.length,
    held: escrowPayments.filter(p => p.escrowStatus === 'held').length,
    released: escrowPayments.filter(p => p.escrowStatus === 'released').length,
    totalHeld: escrowPayments
      .filter(p => p.escrowStatus === 'held')
      .reduce((sum, p) => sum + p.netAmount, 0),
    totalReleased: escrowPayments
      .filter(p => p.escrowStatus === 'released')
      .reduce((sum, p) => sum + p.netAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <DollarSign size={32} />
          Payment Management
        </h1>
        <p className="text-green-100">Manage escrow payments and releases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm mb-1">Total Escrow Payments</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-orange-50 rounded-lg shadow p-6 border border-orange-200">
          <div className="text-orange-700 text-sm mb-1">Held Payments</div>
          <div className="text-3xl font-bold text-orange-700">{stats.held}</div>
          <div className="text-sm text-orange-600 mt-1">
            ${stats.totalHeld.toFixed(2)} held
          </div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
          <div className="text-green-700 text-sm mb-1">Released Payments</div>
          <div className="text-3xl font-bold text-green-700">{stats.released}</div>
          <div className="text-sm text-green-600 mt-1">
            ${stats.totalReleased.toFixed(2)} released
          </div>
        </div>
        <div className="bg-indigo-50 rounded-lg shadow p-6 border border-indigo-200">
          <div className="text-indigo-700 text-sm mb-1">Total Platform Fees</div>
          <div className="text-3xl font-bold text-indigo-700">
            ${escrowPayments.reduce((sum, p) => sum + p.platformFee, 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Payments ({stats.total})
          </button>
          <button
            onClick={() => setFilter('held')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filter === 'held'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Held ({stats.held})
          </button>
          <button
            onClick={() => setFilter('released')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filter === 'released'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Released ({stats.released})
          </button>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Escrow ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Platform Fee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Net Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-gray-600">
                      {payment._id.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-gray-600">
                      {payment.orderId?._id?.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      ${payment.totalAmount?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-orange-600">
                      ${payment.platformFee?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-green-600">
                      ${payment.netAmount?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit ${getStatusColor(payment.escrowStatus)}`}>
                      {getStatusIcon(payment.escrowStatus)}
                      {payment.escrowStatus === 'released' ? 'Released' : 'Held'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowModal(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <DollarSign size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-lg">No payments found</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => {
            setShowModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default PaymentManagement;
