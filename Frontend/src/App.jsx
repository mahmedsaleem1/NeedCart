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
  BuyerDashboard
} from './pages/index.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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

          {/* Add more routes as needed */}
        </Routes>
      </Router>
  )
}

export default App



