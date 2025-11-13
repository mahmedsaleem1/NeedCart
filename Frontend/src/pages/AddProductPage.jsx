import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AddProduct from "../components/Product/AddProduct";
import Navbar from "../components/misc/Navbar";
import Footer from "../components/misc/Footer";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Only sellers can add products
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Please login to add a product
            </h2>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-[#3772ff] text-white rounded-full hover:bg-[#2759dd] transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (role !== "seller") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Only sellers can add products
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-[#3772ff] text-white rounded-full hover:bg-[#2759dd] transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <AddProduct />
      <Footer />
    </>
  );
}



