import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send, Clock, User, DollarSign } from 'lucide-react';
import { auth } from '../../config/firebase/firebase';
import LikeButton from './LikeButton';
import AddComment from './AddComment';
import CommentCard from './CommentCard';
import SendOffer from './SendOffer';
import OfferCard from './OfferCard';
import Navbar from '../misc/Navbar';
import Footer from '../misc/Footer';

export default function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('comments');
  const [currentUserUID, setCurrentUserUID] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);

  // Check for payment status in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const reason = urlParams.get('reason');
    
    if (payment) {
      if (payment === 'error' && reason) {
        setPaymentStatus(`error_${reason}`);
      } else {
        setPaymentStatus(payment);
      }
      // Remove payment param from URL
      window.history.replaceState({}, '', `/post/${postId}`);
      // Auto-dismiss after 8 seconds for errors, 5 seconds for success/cancel
      setTimeout(() => setPaymentStatus(null), payment === 'error' ? 8000 : 5000);
    }
  }, [postId]);

  // Get Firebase UID from Firebase Auth directly (most reliable)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setCurrentUserUID(firebaseUser.uid);
      } else {
        setCurrentUserUID(null);
      }
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      
      // Fetch post details
      const postRes = await fetch(
        `${import.meta.env.VITE_URL}/api/v1/post/get/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const postData = await postRes.json();
      
      if (!postRes.ok) throw new Error(postData.message || 'Failed to fetch post');
      // Handle nested post object or direct post
      const postObj = postData.data?.post || postData.data;
      setPost(postObj);

      // Fetch comments
      const commentsRes = await fetch(
        `${import.meta.env.VITE_URL}/api/v1/comment/get-comments/${postId}`
      );
      const commentsData = await commentsRes.json();
      if (commentsRes.ok) {
        // Backend has data and message swapped - actual data is in message field
        const commentsArray = Array.isArray(commentsData.message) 
          ? commentsData.message 
          : (Array.isArray(commentsData.data) ? commentsData.data : []);
        setComments(commentsArray);
      }

      // Fetch likes
      const likesRes = await fetch(
        `${import.meta.env.VITE_URL}/api/v1/like/get-likes/${postId}`
      );
      const likesData = await likesRes.json();
      if (likesRes.ok) {
        // Backend has data and message swapped - actual data is in message field
        const likesArray = Array.isArray(likesData.message) 
          ? likesData.message 
          : (Array.isArray(likesData.data) ? likesData.data : []);
        setLikes(likesArray);
      }

      // Fetch offers
      const offersRes = await fetch(
        `${import.meta.env.VITE_URL}/api/v1/offer/all/${postId}`
      );
      const offersData = await offersRes.json();
      if (offersRes.ok) {
        // Backend has data and message swapped - actual data is in message field
        const offersArray = Array.isArray(offersData.message) 
          ? offersData.message 
          : (Array.isArray(offersData.data) ? offersData.data : []);
        setOffers(offersArray);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter((c) => c._id !== commentId));
  };

  const handleOfferSent = (newOffer) => {
    setOffers([newOffer, ...offers]);
  };

  const handleOfferUpdated = () => {
    fetchPostData(); // Refresh all data when offer is accepted/rejected
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3772ff] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate('/posts')}
            className="px-6 py-2 bg-[#3772ff] text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!post) return null;

  // Check if current user is post owner - comparing Firebase UIDs
  const postBuyerFirebaseUID = post?.buyerId?.firebaseUID;
  const isPostOwner = currentUserUID && postBuyerFirebaseUID && currentUserUID === postBuyerFirebaseUID;
  const canSendOffer = role === 'seller' && post.status === 'open' && !isPostOwner;
  // Post owner (buyer) should always see offers, sellers can see their sent offers
  const canViewOffers = isPostOwner || role === 'seller';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Payment Status Notification */}
          {paymentStatus && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`mb-6 p-4 rounded-xl ${
                paymentStatus === 'success'
                  ? 'bg-green-100 dark:bg-green-900/20 border border-green-500'
                  : paymentStatus.startsWith('error')
                  ? 'bg-orange-100 dark:bg-orange-900/20 border border-orange-500'
                  : 'bg-red-100 dark:bg-red-900/20 border border-red-500'
              }`}
            >
              <p
                className={`text-center font-semibold mb-3 ${
                  paymentStatus === 'success'
                    ? 'text-green-800 dark:text-green-400'
                    : paymentStatus.startsWith('error')
                    ? 'text-orange-800 dark:text-orange-400'
                    : 'text-red-800 dark:text-red-400'
                }`}
              >
                {paymentStatus === 'success'
                  ? '✅ Payment Successful! Your order has been confirmed.'
                  : paymentStatus === 'cancel'
                  ? '❌ Payment Cancelled. The offer status has not been changed.'
                  : paymentStatus === 'error_missing_order'
                  ? '⚠️ Payment Error: Order information is missing. Please contact support.'
                  : paymentStatus === 'error_invalid_order'
                  ? '⚠️ Payment Error: Invalid order. Please try again or contact support.'
                  : '⚠️ An error occurred during payment processing.'}
              </p>
              {paymentStatus === 'success' && (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => navigate('/posts')}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-colors"
                  >
                    View All Posts
                  </button>
                  <button
                    onClick={() => setPaymentStatus(null)}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full font-semibold transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Post Header */}
            <div className="relative">
              <img
                src={post.image || '/placeholder.png'}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    post.status === 'open'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {post.status === 'open' ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-8">
              <h1
                className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4"
                style={{ fontFamily: "'Lemon Milk', sans-serif" }}
              >
                {post.title}
              </h1>

              <div className="flex items-center gap-6 mb-6 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <span>{post.buyerId?.email || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={20} />
                  <span className="text-[#3772ff] font-bold text-xl">
                    PKR {post.budget?.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
                {post.description}
              </p>

              {/* Actions Bar */}
              <div className="flex items-center gap-6 py-4 border-y border-gray-200 dark:border-gray-700">
                <LikeButton postId={post._id} initialLikes={likes} />
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex items-center gap-2 transition-colors ${
                    activeTab === 'comments'
                      ? 'text-[#3772ff]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-[#3772ff]'
                  }`}
                >
                  <MessageCircle size={24} />
                  <span className="font-semibold">{comments.length} Comments</span>
                </button>
                {canViewOffers && (
                  <button
                    onClick={() => setActiveTab('offers')}
                    className={`flex items-center gap-2 transition-colors ${
                      activeTab === 'offers'
                        ? 'text-[#3772ff]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-[#3772ff]'
                    }`}
                  >
                    <Send size={24} />
                    <span className="font-semibold">{offers.length} Offers</span>
                  </button>
                )}
              </div>

              {/* Send Offer Button (Sellers only) */}
              {canSendOffer && (
                <div className="mt-6">
                  <SendOffer postId={post._id} onOfferSent={handleOfferSent} />
                </div>
              )}

              {/* Tabs Content */}
              <div className="mt-8">
                {activeTab === 'comments' && (
                  <div>
                    {isAuthenticated && (
                      <AddComment postId={post._id} onCommentAdded={handleCommentAdded} />
                    )}
                    <div className="mt-6 space-y-4">
                      {comments.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                          No comments yet. Be the first to comment!
                        </p>
                      ) : (
                        comments.map((comment) => (
                          <CommentCard
                            key={comment._id}
                            comment={comment}
                            isPostOwner={isPostOwner}
                            postOwnerId={post.buyerId?._id}
                            onDelete={handleCommentDeleted}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'offers' && canViewOffers && (
                  <div className="space-y-4">
                    {offers.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        No offers yet.
                      </p>
                    ) : (
                      offers.map((offer) => (
                        <OfferCard
                          key={offer._id}
                          offer={offer}
                          isPostOwner={isPostOwner}
                          postStatus={post.status}
                          onOfferUpdated={handleOfferUpdated}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
