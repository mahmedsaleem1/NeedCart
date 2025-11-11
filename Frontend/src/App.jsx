import {
  Login,
  Signup,
  Logout,
  ForgetPassword,
  Post
} from './components/index.js';
import {
  LandingPage,
  Posts,
  CreatePostPage
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

          {/* Add more routes as needed */}
        </Routes>
      </Router>
  )
}

export default App
