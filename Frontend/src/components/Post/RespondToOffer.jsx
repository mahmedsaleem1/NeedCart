import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase/firebase';

export default function RespondToOffer({ offerId, offerAmount, sellerEmail, onResponse }) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  // Only buyers can respond to offers
  if (role !== 'buyer') {
    return null;
  }

  const handleAccept = async () => {
    if (!window.confirm(`Accept offer of PKR ${offerAmount?.toLocaleString()} from ${sellerEmail}?`)) {
      return;
    }

    setIsAccepting(true);

    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/offer/accept/${offerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        alert('Offer accepted successfully! Redirecting to order placement...');
        
        // Redirect to order-placed route (to be implemented)
        navigate('/order-placed', { 
          state: { 
            offerId, 
            offerAmount,
            sellerEmail 
          } 
        });
        
        if (onResponse) {
          onResponse('accepted');
        }
      } else {
        alert(result.message || 'Failed to accept offer');
      }
    } catch (err) {
      alert(err.message || 'An error occurred while accepting offer');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this offer?')) {
      return;
    }

    setIsRejecting(true);

    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/offer/reject/${offerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        alert('Offer rejected');
        if (onResponse) {
          onResponse('rejected');
        }
      } else {
        alert(result.message || 'Failed to reject offer');
      }
    } catch (err) {
      alert(err.message || 'An error occurred while rejecting offer');
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAccept}
        disabled={isAccepting || isRejecting}
        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition duration-150 flex items-center justify-center gap-2"
      >
        {isAccepting ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Accepting...
          </>
        ) : (
          '✓ Accept Offer'
        )}
      </button>
      
      <button
        onClick={handleReject}
        disabled={isAccepting || isRejecting}
        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition duration-150 flex items-center justify-center gap-2"
      >
        {isRejecting ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Rejecting...
          </>
        ) : (
          '✗ Reject Offer'
        )}
      </button>
    </div>
  );
}