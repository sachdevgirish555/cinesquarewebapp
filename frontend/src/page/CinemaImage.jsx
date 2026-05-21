import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getGalleryByCinema } from "../features/CinemaGallery/gallerySlice";
import { useParams } from "react-router-dom";

const CinemaImage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { galleries } = useSelector((s) => s.gallery);

  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getGalleryByCinema(id));
    }
  }, [dispatch, id]);

  /* ================= FLATTEN IMAGES ================= */

  const images = Array.isArray(galleries)
    ? galleries.flatMap((g) => g.images || [])
    : [];

  /* ================= IMAGE URL FIX ================= */

  const getImageUrl = (img) => {
    const cleanPath = img.replace(/\\/g, "/");

    if (cleanPath.startsWith("uploads")) {
      return `https://backend.cinesquare.in/${cleanPath}`;
    }

    return `https://backend.cinesquare.in/uploads/${cleanPath.replace(
      /^\//,
      "",
    )}`;
  };

  /* ================= LIGHTBOX CONTROLS ================= */

  const nextImage = () =>
    setSelectedIndex((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />

      {/* ================= GRID ================= */}
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]"
        >
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-3xl shadow-lg group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedIndex(i)}
            >
              <img
                src={getImageUrl(img)}
                alt="gallery"
                className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ================= LIGHTBOX ================= */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 text-white hover:text-yellow-400 transition"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Prev */}
            <button
              onClick={prevImage}
              className="absolute left-6 text-white hover:text-yellow-400 transition"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Image */}
            <motion.img
              key={selectedIndex}
              src={getImageUrl(images[selectedIndex])}
              alt="Full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-[90%] max-h-[85%] rounded-2xl shadow-2xl object-contain"
            />

            {/* Next */}
            <button
              onClick={nextImage}
              className="absolute right-6 text-white hover:text-yellow-400 transition"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CinemaImage;
