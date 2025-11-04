import { useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/post/${post._id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
          post.status === 'open' 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-500 text-white'
        }`}>
          {post.status === 'open' ? 'Open' : 'Closed'}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Budget</p>
            <p className="text-lg font-bold text-blue-600">
              PKR {post.budget.toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Posted by</p>
            <p className="text-sm font-medium text-gray-700">
              {post.buyerId?.email || 'Anonymous'}
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
}