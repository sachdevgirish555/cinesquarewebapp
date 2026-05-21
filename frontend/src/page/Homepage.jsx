import React, { Suspense, lazy, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../assets/projector-12630_128.gif";
import BookingSection from "../components/BookingSection";
import HeroSection from "../components/HeroSection";

const JourneyIntro = lazy(() => import("../components/JourneyIntro"));
const About = lazy(() => import("../components/About"));
const News = lazy(() => import("../components/News"));

const SectionLoader = () => (
  <div className="flex justify-center py-20">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
  </div>
);

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);

        setTimeout(() => {
          setShowTransition(true);

          setTimeout(() => {
            setShowTransition(false);
          }, 2500);
        }, 100);
      }, 1000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        <HeroSection />
        <BookingSection />

        <Suspense fallback={<SectionLoader />}>
          <JourneyIntro />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <News />
        </Suspense>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={Loader}
              alt="Loading..."
              className="h-40 w-40 animate-pulse object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showTransition && (
        <motion.div
          key="transition"
          className="fixed inset-0 z-40 bg-textColor"
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      )}
    </div>
  );
};

export default Homepage;
