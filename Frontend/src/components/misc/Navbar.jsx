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
    if (role === "admin") navigate("/admin");
    else if (role === "seller") navigate("/seller");
    else navigate("/buyer"); // buyer or default
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-md shadow-md font-[Lemon Milk]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl md:text-5xl font-bold mb-2 tracking-tight text-[#3772ff]"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          NEEDCART
        </Link>

        {/* Auth / Role Buttons */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-[#3772ff] hover:bg-blue-600 rounded-full text-white font-semibold transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 border border-[#3772ff] rounded-full text-[#3772ff] hover:bg-[#3772ff] hover:text-white font-semibold transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* User Dropdown */}
              <div className="relative group"> 
                <button className="px-4 py-2 rounded-full text-[#3772ff] border border-[#3772ff] hover:bg-[#3772ff] hover:text-white transition-all duration-200">
                  {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-black/90 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={handleDashboard}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-[#3772ff] hover:text-black rounded-lg transition-all duration-200"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-[#3772ff] hover:text-black rounded-lg transition-all duration-200"
                  >
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
