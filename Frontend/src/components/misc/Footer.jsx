// src/components/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Dummy Social Icons (replace with actual SVG or react-icons, e.g., from 'react-icons/fa')
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.812c-3.266 0-4.188 1.452-4.188 4.004v2.996z" /></svg>
);
const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.594 0-6.495 2.902-6.495 6.495 0 .509.057 1.002.162 1.474-5.405-.271-10.211-2.863-13.429-6.812-.563.968-.888 2.088-.888 3.327 0 2.25.998 4.246 2.507 5.422-.977-.031-1.896-.298-2.693-.742v.08c0 3.154 2.247 5.823 5.213 6.435-.487.131-.996.192-1.516.192-.371 0-.73-.035-1.076-.105.83 2.571 3.208 4.45 6.026 4.45 0 .153-.01.305-.01.458 0 .61-.067 1.205-.192 1.78-.173.805-.386 1.579-.628 2.327-.504.629-.824 1.139-.938 1.488-.135.41-.122.75-.084 1.006.02.127.067.243.14.348.073.105.176.196.309.26.133.064.288.098.461.098.243 0 .493-.058.74-.176.247-.118.497-.306.74-.564.243-.258.487-.585.74-.98z"/></svg>
);
const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 7.378c-2.481 0-4.5 2.019-4.5 4.5s2.019 4.5 4.5 4.5 4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5zm0 8.812c-3.454 0-6.25-2.796-6.25-6.25s2.796-6.25 6.25-6.25 6.25 2.796 6.25 6.25-2.796 6.25-6.25 6.25zm5.22-8.537c0 .96-.78 1.74-1.74 1.74s-1.74-.78-1.74-1.74.78-1.74 1.74-1.74 1.74.78 1.74 1.74z"/></svg>
);


const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-800 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-12 px-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      {/* Background gradient and subtle pattern */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-900 to-gray-800 dark:from-black dark:to-gray-950 opacity-90"></div>
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundRepeat: 'repeat', backgroundSize: '100px' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 dark:border-gray-700 pb-8 mb-8">
        {/* About Section */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold text-white dark:text-gray-100 mb-4 tracking-wide">NeedCart</h3>
          <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed mb-4">
            Connecting visionaries with creators, and unique products with passionate buyers. NeedCart is more than a marketplace – it's a community.
          </p>
          <div className="flex space-x-4">
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white dark:hover:text-gray-100 transition-colors duration-300 transform hover:scale-110"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FacebookIcon />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white dark:hover:text-gray-100 transition-colors duration-300 transform hover:scale-110"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <TwitterIcon />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white dark:hover:text-gray-100 transition-colors duration-300 transform hover:scale-110"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <InstagramIcon />
            </motion.a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white dark:text-gray-100 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 text-sm">How it Works</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 text-sm">Become a Seller</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 text-sm">Post a Project</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 text-sm">Help & FAQs</a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold text-white dark:text-gray-100 mb-4">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 text-sm">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 text-sm">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 text-sm">Cookie Policy</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 text-center text-gray-500 dark:text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} NeedCart. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};
export default Footer;


