import React from "react";
import { motion } from "framer-motion";
import { Users, ShoppingBag, Sparkles, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/misc/Footer";
import Navbar from "../components/misc/Navbar.jsx";

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <>
    <Navbar />
    <div className="text-gray-800 dark:text-white font-sans overflow-x-hidden">
      {/* HERO SECTION */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500 text-white relative overflow-hidden"
      >
        {/* Decorative blur elements */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white opacity-10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-400 opacity-20 blur-[100px] rounded-full"></div>
        
        {/* Connecting gradient waves between text and image */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-500/30 via-emerald-600/20 to-transparent blur-3xl opacity-60 pointer-events-none hidden lg:block"></div>

        {/* Hero Content Container */}
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left relative"
            >
              {/* Glow effect behind text */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-2xl opacity-50"></div>
              
              <motion.h1
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight relative drop-shadow-2xl"
                style={{ fontFamily: "'Lemon Milk', sans-serif" }}
              >
                NEEDCART
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed mb-8 mx-auto lg:mx-0 relative drop-shadow-lg"
              >
                Empowering local sellers and buyers to connect, trade, and grow.  
                A modern marketplace built for trust, simplicity, and opportunity.
              </motion.p>

              <motion.button
                onClick={() =>
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-emerald-600 font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2 relative"
              >
                ↓ Learn More
              </motion.button>

              {/* Decorative connecting lines */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="hidden lg:block absolute right-0 top-1/2 w-32 h-[2px] bg-gradient-to-r from-white/40 to-transparent origin-left"
              ></motion.div>
            </motion.div>

            {/* Right Side - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-l from-emerald-400/30 via-transparent to-transparent blur-3xl scale-110"></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 border-4 border-white/10 backdrop-blur-sm">
                {/* Main Hero Image */}
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                  alt="E-commerce Shopping"
                  className="w-full h-[400px] lg:h-[600px] object-cover"
                />
                
                {/* Enhanced Gradient Overlay with smooth edges */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-emerald-800/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-transparent to-transparent"></div>
                
                {/* Floating Stats Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-emerald-600">1000+</div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium">Products</div>
                    </div>
                    <div className="border-l border-r border-gray-200">
                      <div className="text-2xl md:text-3xl font-bold text-emerald-600">500+</div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium">Sellers</div>
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-emerald-600">5000+</div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium">Buyers</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Decorative Elements with smooth blending */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl opacity-50"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7, duration: 0.6 }}
                className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-tr from-rose-400 to-pink-500 rounded-full blur-3xl opacity-50"
              ></motion.div>
              
              {/* Connecting particles effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 1 }}
                className="hidden lg:block absolute -left-16 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 1 }}
                className="hidden lg:block absolute -left-24 top-1/3 w-8 h-8 rounded-full bg-emerald-300/20 backdrop-blur-sm border border-white/20"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-center px-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-8 text-emerald-600"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          About NeedCart
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300"
        >
          Born from the idea that every small business deserves visibility,  
          NeedCart bridges the gap between **passionate sellers** and **curious buyers**.  
          Whether it’s handmade crafts, digital goods, or local products — we make it easy  
          to share your work with the world.
        </motion.p>

        <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl">
          We believe that business is not just about transactions, it’s about stories.  
          Stories that inspire, connect, and make people trust again.
        </p>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="how"
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 text-center px-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-12 text-emerald-600"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl">
          {[
            {
              icon: <Users size={50} className="text-emerald-600" />,
              title: "Join the Platform",
              text: "Create your free profile as a buyer or seller. It only takes 2 minutes to start your journey.",
            },
            {
              icon: <ShoppingBag size={50} className="text-emerald-600" />,
              title: "Showcase Your Products",
              text: "List items with images, prices, and descriptions. Manage inventory easily from your dashboard.",
            },
            {
              icon: <Sparkles size={50} className="text-emerald-600" />,
              title: "Connect & Trade",
              text: "Chat securely, make deals confidently, and grow your reputation through verified reviews.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-10 hover:scale-105 transition-transform border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3
                className="text-2xl font-semibold mb-3"
                style={{ fontFamily: "'Lemon Milk', sans-serif" }}
              >
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section
        id="stats"
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-emerald-600 to-emerald-700 text-white text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-12"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          Our Impact So Far
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl">
          {[
            { number: "10K+", label: "Active Users" },
            { number: "5K+", label: "Products Listed" },
            { number: "1.5K+", label: "Daily Transactions" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="p-8 bg-white/10 rounded-3xl backdrop-blur-md"
            >
              <h3
                className="text-6xl font-extrabold mb-2"
                style={{ fontFamily: "'Lemon Milk', sans-serif" }}
              >
                {item.number}
              </h3>
              <p className="text-lg opacity-90">{item.label}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-lg opacity-90">
          These numbers reflect our belief — that every seller deserves a fair chance  
          and every buyer deserves trust.
        </p>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        id="testimonials"
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 text-center px-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-12 text-emerald-600"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          Voices of Trust
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl">
          {[
            {
              name: "Ali R.",
              comment:
                "NeedCart made my small business grow faster than I ever imagined. The platform feels modern and friendly.",
            },
            {
              name: "Sara K.",
              comment:
                "Finally, a place that values trust and design equally. It’s not just a marketplace — it’s a community.",
            },
            {
              name: "Usman T.",
              comment:
                "I’ve sold 200+ products through NeedCart. The system is smooth, responsive, and built with love.",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-10 hover:scale-105 transition-transform border border-gray-100 dark:border-gray-700"
            >
              <Star className="text-yellow-400 mx-auto mb-3" size={35} />
              <p className="italic text-gray-600 dark:text-gray-300 mb-6 text-lg">
                "{t.comment}"
              </p>
              <h4
                className="font-bold text-emerald-600"
                style={{ fontFamily: "'Lemon Milk', sans-serif" }}
              >
                {t.name}
              </h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GET STARTED SECTION */}
      <section
        id="get-started"
        className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-center px-6 py-20"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-8 text-emerald-600"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          Start Your Journey
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-12"
        >
          Whether you're looking to buy unique products or showcase your own creations,
          NeedCart is your gateway to endless possibilities.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate("/posts")}
            className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-3xl p-10 text-white cursor-pointer hover:scale-105 transition-transform shadow-2xl"
          >
            <Users size={60} className="mb-4 mx-auto" />
            <h3
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Lemon Milk', sans-serif" }}
            >
              Browse Posts
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Discover needs from buyers and offer your services
            </p>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              Explore Posts <ArrowRight size={20} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate("/products")}
            className="bg-gradient-to-br from-rose-600 to-rose-500 rounded-3xl p-10 text-white cursor-pointer hover:scale-105 transition-transform shadow-2xl"
          >
            <ShoppingBag size={60} className="mb-4 mx-auto" />
            <h3
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Lemon Milk', sans-serif" }}
            >
              Shop Products
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Find amazing products from verified sellers
            </p>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              Explore Products <ArrowRight size={20} />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default LandingPage;



