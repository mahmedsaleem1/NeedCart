import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LikeButton from './LikeButton';
import AddComment from './AddComment';
import CommentCard from './CommentCard';
import SendOffer from './SendOffer';
import OfferCard from './OfferCard';
import RespondToOffer from './RespondToOffer';

export default function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Fetch post details
      const postResponse = await fetch(`${import.meta.env.VITE_URL}/api/v1/post/all`);
      const postData = await postResponse.json();
      
      if (postData.success) {
        const foundPost = postData.data.posts.find(p => p._id === postId);
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Post not found');
          return;
        }
      }

      // Fetch likes
      const likesResponse = await fetch(`${import.meta.env.VITE_URL}/api/v1/like/get-likes/${postId}`);
      const likesData = await likesResponse.json();
      if (likesData.success) {
        setLikes(likesData.data);
      }

      // Fetch comments
      const commentsResponse = await fetch(`${import.meta.env.VITE_URL}/api/v1/comment/get-comments/${postId}`);
      const commentsData = await commentsResponse.json();
      if (commentsData.success) {
        setComments(commentsData.data);
      }

      // Fetch offers
      const offersResponse = await fetch(`${import.meta.env.VITE_URL}/api/v1/offer/all/${postId}`);
      const offersData = await offersResponse.json();
      if (offersData.success) {
        setOffers(offersData.data);
      }

    } catch (err) {
      setError(err.message || 'Failed to load post data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(c => c._id !== commentId));
  };

  const handleOfferSent = (newOffer) => {
    setOffers([newOffer, ...offers]);
  };

  const handleOfferResponse = () => {
    fetchPostData(); // Refresh all data after offer response
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Post not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const isPostOwner = user && post.buyerId?.email === user.email;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Main Post Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="relative h-96">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${
              post.status === 'open' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}>
              {post.status === 'open' ? 'Open for Offers' : 'Closed'}
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {post.description}
            </p>

            <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Budget</p>
                <p className="text-2xl font-bold text-blue-600">
                  PKR {post.budget.toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Posted by</p>
                <p className="text-lg font-medium text-gray-700">
                  {post.buyerId?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <LikeButton postId={post._id} initialLikes={likes} />
              
              <div className="text-sm text-gray-500">
                Posted on {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Offers Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Offers ({offers.length})
            </h2>

            {role === 'seller' && post.status === 'open' && (
              <div className="mb-6">
                <SendOffer
                  postId={post._id}
                  postBudget={post.budget}
                  postStatus={post.status}
                  onOfferSent={handleOfferSent}
                />
              </div>
            )}

            <div className="space-y-4">
              {offers.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No offers yet</p>
                </div>
              ) : (
                offers.map(offer => (
                  <div key={offer._id}>
                    <OfferCard offer={offer} />
                    {isPostOwner && offer.status === 'pending' && (
                      <div className="mt-3">
                        <RespondToOffer
                          offerId={offer._id}
                          offerAmount={offer.amount}
                          sellerEmail={offer.senderId?.email}
                          onResponse={handleOfferResponse}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Comments ({comments.length})
            </h2>

            <div className="mb-6">
              <AddComment
                postId={post._id}
                onCommentAdded={handleCommentAdded}
              />
            </div>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map(comment => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    onCommentDeleted={handleCommentDeleted}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}