import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { loginWithEmail, googleLogin } from "../../config/firebase/auth.config.js";
import {useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";
import { login } from "../../store/auth.slice.js";
import ForgetPassword from "./ForgetPassword";
import { Footer } from '../index.js';
import { Navbar } from '../index.js';

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [showForgetPassword, setShowForgetPassword] = useState(false);  

  useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      const token = await loginWithEmail(data.email, data.password);

      const user = await fetch(`${import.meta.env.VITE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await user.json();
      
      if (userData && userData.data.user.email === import.meta.env.VITE_ADMIN_EMAIL) {
        const serializableUserData = {
            uid: userData.data.user.uid,
            email: userData.data.user.email,
            displayName: userData.data.user.displayName,
            photoURL: userData.data.user.photoURL,
            role: 'admin'
        };
        dispatch(login(serializableUserData));
        alert("Admin login successful.");
        navigate("/admin/dashboard");
        return userData;
      }

      else if (userData) { 
        const serializableUserData = {
            uid: userData.data.user.uid, // Store Firebase UID
            email: userData.data.user.email,
            displayName: userData.data.user.displayName,
            photoURL: userData.data.user.photoURL,
            role: userData.data.role
        };

        dispatch(login(serializableUserData));        
        navigate("/");
        return userData
      };

    } catch (err) {
      alert(err.message);
    }
  };

  const handleForgetPasswordClick = () => {
    setShowForgetPassword(!showForgetPassword);
  };

  const handleGoogleLogin = async () => {
    try {
      const userData = await googleLogin();
      const serializableUserData = {
        uid: userData.uid, // Store Firebase UID
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
      };
      dispatch(login(serializableUserData));
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <>
    <Navbar  />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to NeedCart
          </p>
        </div>
        
        <div className="bg-white shadow-xl rounded-lg p-8">
          {!showForgetPassword ? (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-[#3772ff] focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-[#3772ff] focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2759dd] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Sign in
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleForgetPasswordClick}
                  className="text-sm text-[#2759dd] hover:text-[#3772ff] font-medium"
                >
                  Forgot your password?
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-sm text-[#2759dd] hover:text-[#3772ff] font-medium"
                >
                  Don't have an account? Sign up
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div>
              <button
                onClick={handleForgetPasswordClick}
                className="mb-4 text-sm text-[#2759dd] hover:text-[#3772ff] font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Login
              </button>
              <ForgetPassword />
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}


