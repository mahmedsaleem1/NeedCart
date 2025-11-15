import React, { useEffect, useState } from 'react';
import { Package, FileText, Search, Trash2, Eye, X, Tag } from 'lucide-react';
import axios from 'axios';
import { auth } from '../../config/firebase/firebase';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // products or posts
  const [productsLoading, setProductsLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [postsError, setPostsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [productPagination, setProductPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [postPagination, setPostPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, item: null, type: null });

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchPosts();
    }
  }, [activeTab, productPagination.currentPage, postPagination.currentPage]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      
      if (!auth.currentUser) {
        setProductsError('Please login to continue');
        setProductsLoading(false);
        return;
      }
      
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/admin/products?page=${productPagination.currentPage}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setProducts(response.data.data.products);
        setProductPagination(response.data.data.pagination);
      }
    } catch (error) {
      setProductsError('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      
      if (!auth.currentUser) {
        setPostsError('Please login to continue');
        setPostsLoading(false);
        return;
      }
      
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/admin/posts?page=${postPagination.currentPage}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPosts(response.data.data.posts);
        setPostPagination(response.data.data.pagination);
      }
    } catch (error) {
      setPostsError('Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleDelete = async (itemId, type) => {
    try {
      if (!auth.currentUser) {
        alert('Please login to continue');
        return;
      }
      
      const token = await auth.currentUser.getIdToken();
      const endpoint = type === 'product' 
        ? `/api/v1/admin/products/${itemId}`
        : `/api/v1/admin/posts/${itemId}`;
      
      const response = await axios.delete(
        `${import.meta.env.VITE_URL}${endpoint}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`${type === 'product' ? 'Product' : 'Post'} deleted successfully!`);
        setDeleteConfirm({ show: false, item: null, type: null });
        if (type === 'product') {
          fetchProducts();
        } else {
          fetchPosts();
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const ItemDetailsModal = ({ item, type, onClose }) => {
    if (!item) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {type === 'product' ? 'Product Details' : 'Post Details'}
                </h2>
                <p className="text-indigo-100">{item.title}</p>
              </div>
              <button
                onClick={onClose}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Images */}
            {item.images && item.images.length > 0 && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-3">Images</h3>
                <div className="grid grid-cols-3 gap-3">
                  {item.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3">Basic Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium">{item.title}</span>
                </div>
                {type === 'product' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-indigo-600">${item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className="font-medium">{item.stock || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{item.category || 'N/A'}</span>
                    </div>
                  </>
                )}
                <div className="pt-2">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 text-gray-900">{item.description}</p>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3">
                {type === 'product' ? 'Seller Information' : 'Buyer Information'}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {type === 'product' 
                      ? item.sellerId 
                        ? `${item.sellerId.firstName || 'N/A'} ${item.sellerId.lastName || ''}`
                        : 'N/A'
                      : item.buyerId
                        ? `${item.buyerId.firstName || 'N/A'} ${item.buyerId.lastName || ''}`
                        : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">
                    {type === 'product' 
                      ? item.sellerId?.email || 'N/A'
                      : item.buyerId?.email || 'N/A'
                    }
                  </span>
                </div>
                {type === 'product' && item.sellerId?.is_verified !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verified:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.sellerId.is_verified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.sellerId.is_verified ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3">Timeline</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(item.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <button
                onClick={() => {
                  onClose();
                  setDeleteConfirm({ show: true, item, type });
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={20} />
                Delete {type === 'product' ? 'Product' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = ({ item, type, onClose, onConfirm }) => {
    if (!item) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
          <div className="bg-red-600 text-white p-6 rounded-t-xl">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trash2 size={28} />
              Confirm Deletion
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>{item.title}</strong>?
            </p>
            <p className="text-sm text-red-600 font-medium">
              This action cannot be undone.
            </p>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(item._id, type)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentData = activeTab === 'products' ? products : posts;
  const filteredData = currentData.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Package size={32} />
          Products & Posts Management
        </h1>
        <p className="text-indigo-100">Monitor and manage products and buyer posts</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('products');
              setProductPagination({ currentPage: 1, totalPages: 1 });
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package size={20} />
            Products ({products.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('posts');
              setPostPagination({ currentPage: 1, totalPages: 1 });
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
              activeTab === 'posts'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText size={20} />
            Posts ({posts.length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content Grid */}
      {(activeTab === 'products' ? productsLoading : postsLoading) ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              {item.images?.[0] && (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                    {item.title}
                  </h3>
                  {activeTab === 'products' && (
                    <span className="text-indigo-600 font-bold text-lg">
                      ${item.price}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {item.description}
                </p>

                {activeTab === 'products' && item.category && (
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 capitalize">{item.category}</span>
                  </div>
                )}

                {/* Owner */}
                <div className="text-sm text-gray-500 mb-3">
                  {activeTab === 'products' 
                    ? `Seller: ${item.sellerId?.firstName} ${item.sellerId?.lastName}`
                    : `Buyer: ${item.buyerId?.firstName} ${item.buyerId?.lastName}`
                  }
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowModal(true);
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirm({ show: true, item, type: activeTab === 'products' ? 'product' : 'post' });
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredData.length === 0 && !(activeTab === 'products' ? productsLoading : postsLoading) && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
          {activeTab === 'products' ? <Package size={48} /> : <FileText size={48} />}
          <p className="text-lg mt-3">No {activeTab} found</p>
        </div>
      )}

      {/* Pagination */}
      {(activeTab === 'products' ? productPagination : postPagination).totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              if (activeTab === 'products') {
                setProductPagination({ ...productPagination, currentPage: productPagination.currentPage - 1 });
              } else {
                setPostPagination({ ...postPagination, currentPage: postPagination.currentPage - 1 });
              }
            }}
            disabled={(activeTab === 'products' ? productPagination : postPagination).currentPage === 1}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Page {(activeTab === 'products' ? productPagination : postPagination).currentPage} of {(activeTab === 'products' ? productPagination : postPagination).totalPages}
          </span>
          <button
            onClick={() => {
              if (activeTab === 'products') {
                setProductPagination({ ...productPagination, currentPage: productPagination.currentPage + 1 });
              } else {
                setPostPagination({ ...postPagination, currentPage: postPagination.currentPage + 1 });
              }
            }}
            disabled={(activeTab === 'products' ? productPagination : postPagination).currentPage === (activeTab === 'products' ? productPagination : postPagination).totalPages}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ItemDetailsModal
          item={selectedItem}
          type={activeTab === 'products' ? 'product' : 'post'}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      {deleteConfirm.show && (
        <DeleteConfirmModal
          item={deleteConfirm.item}
          type={deleteConfirm.type}
          onClose={() => setDeleteConfirm({ show: false, item: null, type: null })}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductManagement;
