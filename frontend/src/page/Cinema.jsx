import React, { useEffect, useRef } from "react";
import Header from "../components/Header";
import { MapPin, Phone, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { NavLink } from "react-router-dom";
import Video from "../assets/new/video 2.mp4";
import { useDispatch, useSelector } from "react-redux";
import { getCinemas } from "../features/Cinema/cinemaSlice";
import { motion } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231a1a1a'/%3E%3Ctext x='200' y='158' text-anchor='middle' fill='%23555' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";

const ICON_MAP = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Renders social icon links at the bottom of a card */
const SocialLinks = ({ social }) => {
  if (!Array.isArray(social) || social.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-4 flex-wrap">
      {social.map((s, idx) => {
        const Icon = ICON_MAP[s.icon?.toLowerCase()];
        if (!Icon || !s.link?.trim()) return null;
        return (
          <a
            key={idx}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={s.icon}
            className="p-2 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-400
                       hover:bg-yellow-500 hover:text-black
                       transition-all duration-200 hover:scale-110 focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <Icon size={15} />
          </a>
        );
      })}
    </div>
  );
};

/** Renders phone number links */
const PhoneList = ({ phones }) => {
  if (!Array.isArray(phones) || phones.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {phones.map((num, idx) => (
        <a
          key={idx}
          href={`tel:${num}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-white text-xs sm:text-sm font-medium
                     hover:text-yellow-400 w-fit transition-colors duration-200
                     focus-visible:outline-none focus-visible:text-yellow-400"
        >
          <Phone className="text-yellow-400 shrink-0" size={13} />
          {num}
        </a>
      ))}
    </div>
  );
};

/** Single cinema card */
const CinemaCard = ({ cinema, index }) => (
  <motion.div
    key={cinema._id || index}
    custom={index}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
  >
    <NavLink to={`/cinema-image/${cinema._id}`} className="block h-full">
      <div
        className="group relative flex flex-col sm:flex-row bg-[#111]
                   border border-yellow-400/15 rounded-2xl overflow-hidden shadow-xl
                   transition-all duration-300 h-full
                   hover:border-yellow-400/50 hover:shadow-[0_0_24px_rgba(250,204,21,0.12)]"
      >
        {/* Image */}
        <div className="relative w-full sm:w-40 md:w-44 shrink-0 h-48 sm:h-auto overflow-hidden">
          <img
            src={`https://backend.cinesquare.in/uploads/${cinema.img}`}
            alt={cinema.name}
            loading="lazy"
            decoding="async"
            width={176}
            height={240}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMG;
            }}
          />
          {/* Mobile gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden pointer-events-none" />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between p-4 sm:p-5 flex-1 min-w-0">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-yellow-400 uppercase tracking-wide leading-tight mb-1 truncate">
              {cinema.name}
            </h3>

            <p className="flex items-start gap-1.5 text-white text-xs sm:text-sm font-semibold mb-2">
              <MapPin className="text-yellow-400 shrink-0 mt-0.5" size={14} />
              <span>{cinema.city}</span>
            </p>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3">
              {cinema.address}
            </p>

            <PhoneList phones={cinema.phone} />
          </div>

          <SocialLinks social={cinema.social} />
        </div>

        {/* Hover glow ring */}
        <div
          className="absolute inset-0 rounded-2xl border border-yellow-400/0
                     group-hover:border-yellow-400/30 transition-all duration-300 pointer-events-none"
        />
      </div>
    </NavLink>
  </motion.div>
);

// ─── Page Component ───────────────────────────────────────────────────────────

const Cinema = () => {
  const dispatch = useDispatch();
  const { cinemas } = useSelector((s) => s.cinema);

  useEffect(() => {
    dispatch(getCinemas());
  }, [dispatch]);

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      {/* Page Hero — video is handled inside Header */}
      <Header BgVideo={Video} heading="Our Cinemas" />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        {/* Section heading */}
        <motion.h2
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400
                     mb-8 sm:mb-12 text-center tracking-widest leading-tight"
        >
          Explore Cine Square Cinemas Across India
        </motion.h2>

        {/* Cards grid */}
        {cinemas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {cinemas.map((cinema, index) => (
              <CinemaCard key={cinema._id || index} cinema={cinema} index={index} />
            ))}
          </div>
        ) : (
          /* Empty / loading state */
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8"
            aria-busy="true"
            aria-label="Loading cinemas"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row bg-[#111] border border-yellow-400/10
                           rounded-2xl overflow-hidden shadow-xl animate-pulse h-40 sm:h-36"
              >
                <div className="w-full sm:w-40 md:w-44 h-40 sm:h-full bg-white/5 shrink-0" />
                <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Cinema;