import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Film } from "lucide-react";

const Investors = () => {
  return (
    <div className="min-h-screen bg-primary text-textColor relative overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-primary/80 to-black/90"></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.15)_0%,_transparent_70%)]"
      ></motion.div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 py-32 md:py-44">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-6 text-yellow-400"
        >
          <Film size={80} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold mb-4 tracking-wide"
        >
          Investors Section
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-8"
        >
          We’re working on something special for our valued investors.
          <br />
          Stay tuned for updates and exciting opportunities with{" "}
          <span className="text-yellow-400 font-semibold">
            Cine Square Cinemas
          </span>
          .
        </motion.p>

        {/* Coming Soon Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="px-8 py-3 bg-yellow-400 text-primary font-semibold rounded-full hover:bg-yellow-500 transition-all duration-300 shadow-lg"
        >
          Coming Soon
        </motion.button>
      </div>

      {/* Decorative Line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-transparent"
      />
    </div>
  );
};

export default Investors;
