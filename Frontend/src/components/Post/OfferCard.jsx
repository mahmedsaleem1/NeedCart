export default function OfferCard({ offer, showActions = false, onAccept, onReject }) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Accepted' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {offer.senderId?.email?.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <p className="font-medium text-gray-900">
              {offer.senderId?.email || 'Anonymous Seller'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Sent on {new Date(offer.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {getStatusBadge(offer.status)}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-1">Offer Amount</p>
        <p className="text-2xl font-bold text-blue-600">
          PKR {offer.amount?.toLocaleString()}
        </p>
      </div>

      {showActions && offer.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={() => onAccept(offer._id)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium transition duration-150"
          >
            Accept Offer
          </button>
          <button
            onClick={() => onReject(offer._id)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 font-medium transition duration-150"
          >
            Reject Offer
          </button>
        </div>
      )}

      {offer.status === 'accepted' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-sm text-green-800 font-medium">
            ✓ This offer has been accepted
          </p>
        </div>
      )}

      {offer.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-sm text-red-800 font-medium">
            ✗ This offer was rejected
          </p>
        </div>
      )}
    </div>
  );
}