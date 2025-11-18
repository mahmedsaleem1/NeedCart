import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/auth.slice.js";

const Navbar = () => {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleDashboard = () => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "seller") navigate("/seller");
    else navigate("/buyer"); // buyer or default
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-emerald-700/95 via-emerald-600/95 to-emerald-500/95 backdrop-blur-lg shadow-2xl border-b border-emerald-300/20 font-[Lemon Milk]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl md:text-5xl font-bold tracking-tight text-white hover:text-white/90 hover:scale-105 transition-transform duration-300 drop-shadow-lg"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          NEEDCART
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            to="/posts"
            className="group relative px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all duration-300 border border-white/30 hover:border-white hover:shadow-lg hover:shadow-white/30 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Posts
            </span>
            <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>
          
          <Link
            to="/products"
            className="group relative px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all duration-300 border border-white/30 hover:border-white hover:shadow-lg hover:shadow-white/30 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Products
            </span>
            <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>
        </nav>

        {/* Auth / Role Buttons */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-6 py-2.5 bg-white text-emerald-600 hover:bg-white/90 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 border-2 border-white rounded-xl text-white hover:bg-white hover:text-emerald-600 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/30 hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* User Dropdown */}
              <div className="relative group"> 
                <button className="px-6 py-2.5 rounded-xl text-white font-semibold bg-white/10 border border-white/40 hover:border-white hover:bg-white/20 hover:shadow-lg hover:shadow-white/30 transition-all duration-300 hover:scale-105">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'User'}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-emerald-600/95 to-emerald-500/95 backdrop-blur-md rounded-xl shadow-2xl border border-emerald-300/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                  <button
                    onClick={handleDashboard}
                    className="flex items-center gap-3 w-full text-left px-5 py-3 text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-5 py-3 text-white hover:bg-red-500/80 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;



