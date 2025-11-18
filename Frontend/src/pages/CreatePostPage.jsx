import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CreatePost from '../components/Post/CreatePost';
import Navbar from '../components/misc/Navbar';
import Footer from '../components/misc/Footer';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Only buyers can create posts
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Please login to create a post
            </h2>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (role !== 'buyer') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Only buyers can create posts
            </h2>
            <button
              onClick={() => navigate('/posts')}
              className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
            >
              Browse Posts
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CreatePost />
      <Footer />
    </>
  );
}



