import {
  Login,
  Signup,
  Logout,
  ForgetPassword,
  Post,
  Product
} from './components/index.js';
import {
  LandingPage,
  Posts,
  CreatePostPage,
  Products,
  AddProductPage,
  Wishlist,
  MyProducts,
  SellerDashboard,
  BuyerDashboard,
  AdminLayout,
  AdminDashboard,
  SellerManagement,
  OrderManagement,
  UserManagement,
  ProductManagement,
  PaymentManagement,
  Analytics,
  TransactionManagement,
  NotFound
} from './pages/index.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chatbot from './components/Chatbot';

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Post Routes */}
          <Route path="/posts" element={<Posts />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/create-post" element={<CreatePostPage />} />

          {/* Product Routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/my-products" element={<MyProducts />} />

          {/* Seller Dashboard Route */}
          <Route path="/seller" element={<SellerDashboard />} />

          {/* Buyer Dashboard Route */}
          <Route path="/buyer" element={<BuyerDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="sellers" element={<SellerManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="transactions" element={<TransactionManagement />} />
          </Route>

          {/* 404 Not Found - Catch all route (must be last) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Floating Chatbot - Available on all pages */}
        <Chatbot />
      </Router>
  )
}

export default App



