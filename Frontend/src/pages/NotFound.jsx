import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 - Page Not Found | NeedCart';
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            404
          </h1>
          <div className="flex justify-center mb-6">
            <svg
              className="w-64 h-64 text-purple-400 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-md text-gray-500">
            Don't worry, let's get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoHome}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Go to Homepage
          </button>
          <button
            onClick={handleGoBack}
            className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200"
          >
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 mb-4 font-medium">You might want to visit:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/posts')}
              className="text-purple-600 hover:text-purple-800 hover:underline font-medium transition-colors"
            >
              Posts
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/products')}
              className="text-purple-600 hover:text-purple-800 hover:underline font-medium transition-colors"
            >
              Products
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/wishlist')}
              className="text-purple-600 hover:text-purple-800 hover:underline font-medium transition-colors"
            >
              Wishlist
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/login')}
              className="text-purple-600 hover:text-purple-800 hover:underline font-medium transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
