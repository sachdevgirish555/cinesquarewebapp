import React, { useState } from "react";
import * as FramerMotion from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image1 from "../assets/first.jpg";
import Image2 from "../assets/second.jpg";
import Image3 from "../assets/third.jpg";
import Image4 from "../assets/footer-bg-BZU_8E62.png";
import Navbar from "../components/Navbar";

const { AnimatePresence, motion: Motion } = FramerMotion;

const Gallery = () => {
  const images = [Image1, Image2, Image3, Image4];

  const [selectedIndex, setSelectedIndex] = useState(null);

  const nextImage = () =>
    setSelectedIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 py-30">
        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]"
        >
          {images.map((img, i) => (
            <Motion.div
              key={i}
              className="relative overflow-hidden rounded-3xl shadow-lg group cursor-pointer
                
              "
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedIndex(i)}
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </Motion.div>
          ))}
        </Motion.div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Motion.div
            key="lightbox"
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 text-white hover:text-yellow-400 transition"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Prev Button */}
            <button
              onClick={prevImage}
              className="absolute left-6 text-white hover:text-yellow-400 transition"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Image */}
            <Motion.img
              key={selectedIndex}
              src={images[selectedIndex]}
              alt={`Full ${selectedIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-[90%] max-h-[85%] rounded-2xl shadow-2xl object-contain"
            />

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-6 text-white hover:text-yellow-400 transition"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
