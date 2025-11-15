import React, { useEffect, useState } from 'react';
import { FileText, Search, Eye, X, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { auth } from '../../config/firebase/firebase';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, pagination.currentPage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      if (!auth.currentUser) {
        setError('Please login to continue');
        setLoading(false);
        return;
      }
      
      const token = await auth.currentUser.getIdToken();
      
      // Map 'succeeded' filter to include 'paid' status as well
      let statusParam = '';
      if (statusFilter !== 'all') {
        if (statusFilter === 'succeeded') {
          // Don't filter by status in URL, we'll filter client-side to include both 'succeeded' and 'paid'
          statusParam = '';
        } else {
          statusParam = `&status=${statusFilter}`;
        }
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/admin/transactions?page=${pagination.currentPage}&limit=20${statusParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        let filteredTransactions = response.data.data.transactions;
        
        // Client-side filter for 'succeeded' to include 'paid'
        if (statusFilter === 'succeeded') {
          filteredTransactions = filteredTransactions.filter(
            t => t.paymentStatus === 'succeeded' || t.paymentStatus === 'paid'
          );
        }
        
        setTransactions(filteredTransactions);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status === 'paid' ? 'succeeded' : status;
    const colors = {
      succeeded: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      processing: 'bg-blue-100 text-blue-700',
    };
    return colors[normalizedStatus] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status === 'paid' ? 'succeeded' : status;
    switch (normalizedStatus) {
      case 'succeeded':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'failed':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusText = (status) => {
    return status === 'paid' ? 'Succeeded' : status.charAt(0).toUpperCase() + status.slice(1);
  };

  const TransactionDetailsModal = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">Transaction Details</h2>
                <p className="text-indigo-100 font-mono text-sm">ID: {transaction._id}</p>
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
              <span className="text-gray-600 font-medium">Payment Status:</span>
              <span className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${getStatusColor(transaction.paymentStatus)}`}>
                {getStatusIcon(transaction.paymentStatus)}
                {getStatusText(transaction.paymentStatus)}
              </span>
            </div>

            {/* Payment Information */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3">Payment Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-2xl text-indigo-600">
                    ${transaction.amount?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{transaction.paymentMethod}</span>
                </div>
                {transaction.stripePaymentIntentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stripe Payment ID:</span>
                    <span className="font-mono text-sm">{transaction.stripePaymentIntentId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Buyer Information */}
            {transaction.buyerId && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-3">Buyer Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">
                      {transaction.buyerId.firstName} {transaction.buyerId.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{transaction.buyerId.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Product/Offer Information */}
            {(transaction.productId || transaction.offerId) && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-3">
                  {transaction.productId ? 'Product Details' : 'Offer Details'}
                </h3>
                <div className="space-y-2">
                  {transaction.productId && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product ID:</span>
                        <span className="font-mono text-sm">{transaction.productId._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product Name:</span>
                        <span className="font-medium">{transaction.productId.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold">${transaction.productId.price?.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  {transaction.offerId && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Offer ID:</span>
                        <span className="font-mono text-sm">{transaction.offerId._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Offer Amount:</span>
                        <span className="font-semibold">${transaction.offerId.amount?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Offer Status:</span>
                        <span className="font-medium capitalize">{transaction.offerId.status}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3">Timeline</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Created:</span>
                  <span className="font-medium">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(transaction.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const stats = {
    total: transactions.length,
    succeeded: transactions.filter(t => t.paymentStatus === 'succeeded' || t.paymentStatus === 'paid').length,
    pending: transactions.filter(t => t.paymentStatus === 'pending').length,
    failed: transactions.filter(t => t.paymentStatus === 'failed').length,
    totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FileText size={32} />
          Transaction History
        </h1>
        <p className="text-indigo-100">Complete payment transaction records</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm mb-1">Total Transactions</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
          <div className="text-green-700 text-sm mb-1">Succeeded</div>
          <div className="text-3xl font-bold text-green-700">{stats.succeeded}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-6 border border-yellow-200">
          <div className="text-yellow-700 text-sm mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-700">{stats.pending}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-6 border border-red-200">
          <div className="text-red-700 text-sm mb-1">Failed</div>
          <div className="text-3xl font-bold text-red-700">{stats.failed}</div>
        </div>
        <div className="bg-indigo-50 rounded-lg shadow p-6 border border-indigo-200">
          <div className="text-indigo-700 text-sm mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-indigo-700">
            ${stats.totalAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-2 flex-wrap">
          {['all', 'succeeded', 'pending', 'failed', 'processing'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Buyer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-gray-600">
                      {transaction._id.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {transaction.buyerId?.firstName} {transaction.buyerId?.lastName}
                      </div>
                      <div className="text-gray-500">{transaction.buyerId?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-lg text-gray-900">
                      ${transaction.amount?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {transaction.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit ${getStatusColor(transaction.paymentStatus)}`}>
                      {getStatusIcon(transaction.paymentStatus)}
                      {getStatusText(transaction.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedTransaction(transaction);
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

          {transactions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-lg">No transactions found</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default TransactionManagement;
