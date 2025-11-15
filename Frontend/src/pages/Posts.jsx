import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Filter, Search } from 'lucide-react';
import Navbar from '../components/misc/Navbar';
import Footer from '../components/misc/Footer';
import PostCard from '../components/Post/PostCard';

export default function Posts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, open, closed

  const { role, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/post/all`);
      const result = await response.json();

      if (response.ok) {
        setPosts(result.data.posts || []);
      } else {
        setError(result.message || 'Failed to fetch posts');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || post.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1
              className="text-5xl md:text-6xl font-extrabold text-[#3772ff] mb-4"
              style={{ fontFamily: "'Lemon Milk', sans-serif" }}
            >
              Browse Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Discover needs from buyers and offer your services
            </p>
          </motion.div>

          {/* Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#3772ff] focus:border-[#3772ff] transition-all"
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter size={20} className="text-gray-600 dark:text-gray-300" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#3772ff] focus:border-[#3772ff] transition-all"
                >
                  <option value="all">All Posts</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>

                {/* Create Post Button (Buyers Only) */}
                {isAuthenticated && role === 'buyer' && (
                  <motion.button
                    onClick={() => navigate('/create-post')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#3772ff] to-[#5c8cff] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus size={20} />
                    Create Post
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Posts Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3772ff] mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-xl mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="px-6 py-2 bg-[#3772ff] text-white rounded-full hover:bg-[#2759dd] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-500 dark:text-gray-400 text-xl">
                {searchTerm || filterStatus !== 'all'
                  ? 'No posts found matching your criteria'
                  : 'No posts available yet'}
              </p>
              {isAuthenticated && role === 'buyer' && (
                <motion.button
                  onClick={() => navigate('/create-post')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 bg-gradient-to-r from-[#3772ff] to-[#5c8cff] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Create First Post
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full"
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}



