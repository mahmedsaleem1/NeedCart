// CreatePostPage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from '../../config/firebase/firebase';
import { motion } from "framer-motion";

const CreatePost = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    const token = await auth.currentUser.getIdToken();

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("budget", data.budget);
      formData.append("image", data.image[0]);

      const response = await fetch(`${import.meta.env.VITE_URL}/post/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to create post");

      setMessage(result.message || "Post created successfully");
      reset();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border border-gray-100 dark:border-gray-700"
      >
        <h2 className="text-4xl font-extrabold text-[#3772ff] mb-6 text-center" style={{ fontFamily: "'Lemon Milk', sans-serif" }}>
          Create a New Post
        </h2>

        {message && (
          <p className={`mb-4 text-center font-medium ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Title"
            {...register("title")}
            className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            required
          />
          <textarea
            placeholder="Description"
            {...register("description")}
            className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white resize-none h-28"
            required
          />
          <input
            type="number"
            placeholder="Budget"
            {...register("budget")}
            className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="file"
            {...register("image")}
            accept="image/*"
            className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#3772ff] to-[#5c8cff] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Post"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;



