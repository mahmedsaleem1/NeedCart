import {
  Login,
  Signup,
  Logout,
  ForgetPassword 
} from './components/index.js';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/logout" element={<Logout />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/upload" element={<UploadPage />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* Add more routes as needed */}
        </Routes>
      </Router>
  )
}

export default App
