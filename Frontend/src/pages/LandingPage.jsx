import React from "react";
import { motion } from "framer-motion";
import { Users, ShoppingBag, Sparkles, Star } from "lucide-react";
import Footer from "../components/misc/Footer";
import Navbar from "../components/misc/Navbar.jsx";

const LandingPage = () => {
  return (
    <>
    <Navbar />
    <div className="text-gray-800 dark:text-white font-sans overflow-x-hidden">
      {/* HERO SECTION */}
      <section
        id="hero"
        className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#3772ff] to-blue-400 text-white text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white opacity-10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-200 opacity-20 blur-[100px] rounded-full"></div>

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-7xl md:text-8xl font-extrabold mb-6 tracking-tight"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          NEEDCART
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl md:text-2xl max-w-3xl leading-relaxed"
        >
          Empowering local sellers and buyers to connect, trade, and grow.  
          A modern marketplace built for trust, simplicity, and opportunity.
        </motion.p>

        <motion.button
          onClick={() =>
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-10 bg-white text-[#3772ff] font-semibold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform"
        >
          ↓ Learn More
        </motion.button>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-center px-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-8 text-[#3772ff]"
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
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-blue-100 dark:from-gray-800 dark:to-gray-700 text-center px-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-12 text-[#3772ff]"
          style={{ fontFamily: "'Lemon Milk', sans-serif" }}
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl">
          {[
            {
              icon: <Users size={50} className="text-[#3772ff]" />,
              title: "Join the Platform",
              text: "Create your free profile as a buyer or seller. It only takes 2 minutes to start your journey.",
            },
            {
              icon: <ShoppingBag size={50} className="text-[#3772ff]" />,
              title: "Showcase Your Products",
              text: "List items with images, prices, and descriptions. Manage inventory easily from your dashboard.",
            },
            {
              icon: <Sparkles size={50} className="text-[#3772ff]" />,
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
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#3772ff] to-blue-600 text-white text-center"
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
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 text-center px-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-12 text-[#3772ff]"
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
                className="font-bold text-[#3772ff]"
                style={{ fontFamily: "'Lemon Milk', sans-serif" }}
              >
                {t.name}
              </h4>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default LandingPage;
