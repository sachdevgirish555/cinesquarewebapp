import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Film, Award } from "lucide-react";
import { useRef } from "react";

const JourneyIntro = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.15,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const words = [
    { text: "MOVIES", color: "text-amber-400" },
    { text: "MAGIC", color: "text-white" },
    { text: "&", color: "text-amber-400" },
    { text: "ENTERTAINMENT", color: "text-white" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative bg-primary text-white min-h-screen flex items-center py-12 sm:py-20 px-4 sm:px-6 overflow-hidden"
    >
      {/* Subtle radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.05),transparent_50%)]" />

      {/* Floating blurred lights */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-textColor rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Top gradient line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Main Content */}
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        style={{ opacity, scale }}
      >
        {/* LEFT SIDE */}
        <motion.div className="space-y-10" variants={itemVariants}>
          {/* Description Card */}
          <motion.div
            className="relative p-8 bg-primary/5 backdrop-blur-md rounded-3xl border border-slate-700/50 shadow-2xl"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -top-3 -right-3 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl" />

            <motion.p
              className="text-xl md:text-2xl leading-relaxed"
              variants={itemVariants}
              whileInView="visible"
            >
              <span className="font-bold uppercase text-amber-400 text-2xl md:text-3xl">
                Cine Square
              </span>{" "}
              has taken a proactive initiative to enhance the movie-watching
              experience for people across India and Invites Franchise Partners
              Pan India.
            </motion.p>

            {/* <motion.div
              className="mt-8 pt-6 border-t border-slate-700/50"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h6 className="text-2xl font-bold">XYZ... & XYZ...</h6>
                  <p className="text-sm text-slate-400 uppercase tracking-widest mt-1">
                    Founders & Directors
                  </p>
                </div>
              </div>
            </motion.div> */}
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              className="relative group p-6 bg-primary/5 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <motion.h4
                  className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-br text-textColor bg-clip-text  mb-2"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: false }}
                >
                  20+
                </motion.h4>
                <p className="text-sm md:text-base text-slate-300 font-medium leading-tight">
                  Years of Industry Experience
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative group p-6 bg-primary/5 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <motion.h4
                  className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-br text-textColor bg-clip-text  mb-2"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: false }}
                >
                  18+
                </motion.h4>
                <p className="text-sm md:text-base text-slate-300 font-medium leading-tight">
                  Cinema Screens Operational
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        {/* RIGHT SIDE */}
        <motion.div className="space-y-8" variants={itemVariants}>
          <div className="space-y-4">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight break-words"
              style={{ perspective: "1000px" }}
            >
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.4 }}
                  className={`inline-block ${word.color} mr-4 mb-2`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {word.text}
                </motion.span>
              ))}
            </motion.h1>

            <motion.div
              className="h-1 w-32 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 128 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              viewport={{ once: true }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient line */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
      />
    </div>
  );
};

export default JourneyIntro;
