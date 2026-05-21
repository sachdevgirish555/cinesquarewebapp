import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { getSlider } from "../features/Slider/sliderSlice";
import Navbar from "./Navbar";

const HeroSection = () => {
  const dispatch = useDispatch();
  const { sliders, loading } = useSelector((state) => state.slider);

  useEffect(() => {
    dispatch(getSlider());
  }, [dispatch]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: false,
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "clamp(300px, 55vw, 100vh)" }}>
      <Navbar />

      <Slider {...settings} className="hero-slider h-full">
        {sliders.map((slide, index) => (
          <div key={index} className="relative h-full w-full">
            {/* Background Image */}
            <img
              src={`https://backend.cinesquare.in/uploads/${slide.img}`}
              alt={slide.text}
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div
              className="relative z-10 flex h-full items-end"
              style={{ padding: "clamp(12px, 4vw, 80px) clamp(12px, 5vw, 80px)" }}
            >
              <div className="w-full max-w-2xl">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="font-extrabold uppercase leading-tight tracking-wide text-yellow-400"
                  style={{ fontSize: "clamp(16px, 5vw, 56px)" }}
                >
                  {slide.text}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                  className="mt-2 leading-snug text-white/80"
                  style={{ fontSize: "clamp(10px, 2.5vw, 18px)", marginTop: "clamp(4px, 1.5vw, 16px)" }}
                >
                  Experience cinema like never before. Immersive visuals,
                  premium sound, and unforgettable moments.
                </motion.p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <style>{`
        .hero-slider,
        .hero-slider .slick-list,
        .hero-slider .slick-track,
        .hero-slider .slick-slide,
        .hero-slider .slick-slide > div {
          height: 100% !important;
        }

        /* Smallest phones (320px and below) */
        @media (max-width: 320px) {
          .hero-slider .slick-slide > div > div {
            padding-bottom: 14px !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;