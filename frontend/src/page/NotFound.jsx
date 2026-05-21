import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  /* ── Auto redirect after 10 s ── */
  useEffect(() => {
    if (countdown === 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  /* ── Film-strip holes ── */
  const holes = Array.from({ length: 8 });

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* ── Subtle radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(250,196,0,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Film strip top ── */}
      <FilmStrip holes={holes} />

      {/* ── Main card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full"
      >
        {/* Projector icon */}
        <motion.div
          animate={{ rotate: [0, -3, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-6 text-textColor"
        >
          <ProjectorIcon />
        </motion.div>

        {/* 404 number */}
        <div className="relative mb-4">
          <motion.h1
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
            className="text-[9rem] md:text-[12rem] font-black leading-none tracking-tighter text-textColor select-none"
            style={{ textShadow: "0 0 60px rgba(250,196,0,0.35)" }}
          >
            404
          </motion.h1>
          {/* scratchy film grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.05) 2px,rgba(255,255,255,0.05) 4px)",
            }}
          />
        </div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-white mb-3"
        >
          Reel Not Found
        </motion.h2>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="text-gray-400 text-base md:text-lg mb-8 max-w-md leading-relaxed"
        >
          Looks like this scene was cut from the final edit. The page you're
          looking for doesn't exist or has been moved.
        </motion.p>

        {/* Countdown bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-xs mb-6"
        >
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Auto-redirecting to Home</span>
            <span className="text-textColor font-semibold">{countdown}s</span>
          </div>
          <div className="w-full h-1.5 bg-secondPrimary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-textColor rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-textColor text-black font-bold rounded-full text-sm tracking-wide hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg"
            style={{ boxShadow: "0 4px 24px rgba(250,196,0,0.3)" }}
          >
            🎬 Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 border border-gray-600 text-gray-300 font-semibold rounded-full text-sm tracking-wide hover:border-textColor hover:text-textColor active:scale-95 transition-all duration-200"
          >
            ← Go Back
          </button>
        </motion.div>
      </motion.div>

      {/* ── Film strip bottom ── */}
      <FilmStrip holes={holes} flip />

      {/* ── Floating film-reel particles ── */}
      <Particles />
    </div>
  );
};

/* ────────────────────────────────────────────
   Sub-components
──────────────────────────────────────────── */

const FilmStrip = ({ holes, flip }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className={`absolute ${flip ? "bottom-0" : "top-0"} left-0 right-0 h-14 bg-secondPrimary flex items-center justify-around px-2 z-0`}
  >
    {holes.map((_, i) => (
      <div
        key={i}
        className="w-7 h-8 rounded-sm border-2 border-gray-700 bg-black"
      />
    ))}
  </motion.div>
);

const ProjectorIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* lens */}
    <circle cx="28" cy="32" r="14" stroke="currentColor" strokeWidth="3" />
    <circle cx="28" cy="32" r="7" stroke="currentColor" strokeWidth="2" />
    <circle cx="28" cy="32" r="2.5" fill="currentColor" />
    {/* body */}
    <rect x="6" y="24" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="3" />
    {/* reels */}
    <circle cx="52" cy="20" r="7" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="52" cy="44" r="7" stroke="currentColor" strokeWidth="2.5" />
    {/* film strip connector */}
    <line x1="44" y1="24" x2="42" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="44" y1="40" x2="42" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* light beam */}
    <line x1="22" y1="28" x2="6" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
    <line x1="22" y1="36" x2="6" y2="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
  </svg>
);

const Particles = () => {
  const dots = [
    { top: "20%", left: "8%", delay: 0 },
    { top: "65%", left: "5%", delay: 1.2 },
    { top: "35%", left: "92%", delay: 0.5 },
    { top: "75%", left: "88%", delay: 1.8 },
    { top: "50%", left: "15%", delay: 2.2 },
    { top: "25%", left: "80%", delay: 0.9 },
  ];

  return (
    <>
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-textColor opacity-20"
          style={{ top: d.top, left: d.left }}
          animate={{ y: [0, -12, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            delay: d.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

export default NotFound;
