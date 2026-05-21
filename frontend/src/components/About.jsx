import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Facebook, Instagram,
  Twitter, Youtube, ArrowBigRight,
  Pause, Play, Volume2, VolumeX,
} from "lucide-react";
import BgVideo from "../assets/new/video 1.mp4";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCinemas } from "../features/Cinema/cinemaSlice";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='380' viewBox='0 0 400 380'%3E%3Crect width='400' height='380' fill='%231a1a1a'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%23333' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";

const ICON_MAP = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

const BackgroundVideo = ({ src, videoRef }) => (
  <video
    ref={videoRef}
    src={src}
    autoPlay
    loop
    playsInline
    muted
    preload="metadata"
    className="absolute inset-0 w-full h-full object-cover"
    style={{ willChange: "transform" }}
  />
);

const About = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cinemas } = useSelector((s) => s.cinema);

  useEffect(() => {
    dispatch(getCinemas());
  }, [dispatch]);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.volume = volume;
    v.play().catch(() => {});
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const val = parseFloat(e.target.value);
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  }, []);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, delay },
  });

  return (
    <div className="bg-primary text-white min-h-screen">

      {/* Hero Video */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(260px, 56vw, 90vh)" }}
      >
        <BackgroundVideo src={BgVideo} videoRef={videoRef} />
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

        {/* Video Controls */}
        <div
          className="absolute z-20 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full border border-yellow-400/20"
          style={{
            bottom: "clamp(8px, 2.5vw, 20px)",
            right: "clamp(8px, 2.5vw, 20px)",
          }}
        >
          <button
            onClick={togglePlay}
            className="text-yellow-400 hover:text-yellow-300 transition-colors p-1"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          </button>

          <button
            onClick={toggleMute}
            className="text-yellow-400 hover:text-yellow-300 transition-colors p-1"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="hidden sm:block w-16 md:w-20 accent-yellow-400 cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>

      {/* About Text */}
      <section className="max-w-5xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          {...fadeUp()}
          className="font-bold text-yellow-400 mb-6 sm:mb-8"
          style={{ fontSize: "clamp(22px, 6vw, 48px)" }}
        >
          ABOUT CINE SQUARE CINEMAS
        </motion.h2>

        <motion.p
          {...fadeUp(0.15)}
          className="text-gray-300 leading-relaxed text-justify"
          style={{ fontSize: "clamp(13px, 2.5vw, 17px)" }}
        >
          Cine Square Entertainment Private Limited (CSEPL) is an innovative
          entertainment company with a reputation for building progressive and
          world-class cinemas, Miniplexes and Multiplexes. Thriving in the
          industry for over 3 decades in distribution and exhibition, we now
          help create cozy family entertainment experiences at your location
          across India. Headquartered in Indore (MP), CSEPL assists theatre
          owners, builders, developers, and proprietors to set up smart luxury
          cinemas across India. Our expert team takes pride in establishing
          multiplexes, cineplexes, and mini theatres in Tier I, Tier II, and
          Tier III cities. Currently, we have 18 World-class Cinema Screens
          operational &amp; Coming up with 20+ Screens Pan India Very Soon.
        </motion.p>
      </section>

      {/* Our Cinemas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        <motion.h2
          {...fadeUp()}
          className="font-bold text-yellow-400 text-center mb-8 sm:mb-12"
          style={{ fontSize: "clamp(20px, 5vw, 40px)" }}
        >
          OUR CINEMAS
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          {cinemas.slice(0, 2).map((cinema, index) => (
            <motion.div
              key={cinema._id ?? index}
              {...fadeUp(index * 0.12)}
              onClick={() => navigate(`/cinema-image/${cinema._id}`)}
              className="cursor-pointer"
            >
              <div className="relative bg-black/50 backdrop-blur-lg border border-yellow-400/20 rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:shadow-yellow-400/40 active:scale-[0.99]">

                {/* Image */}
                <div
                  className="w-full lg:w-1/2 relative"
                  style={{ height: "clamp(180px, 45vw, 380px)" }}
                >
                  <img
                    src={`https://backend.cinesquare.in/uploads/${cinema.img}`}
                    alt={cinema.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMG;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                </div>

                {/* Info */}
                <div
                  className="w-full lg:w-1/2 flex flex-col justify-between"
                  style={{ padding: "clamp(14px, 4vw, 32px)" }}
                >
                  <div>
                    <h3
                      className="font-bold text-yellow-400 mb-1"
                      style={{ fontSize: "clamp(16px, 4vw, 22px)" }}
                    >
                      {cinema.name}
                    </h3>
                    <p
                      className="flex items-center text-white mb-2"
                      style={{ fontSize: "clamp(12px, 3vw, 14px)" }}
                    >
                      <MapPin className="mr-1.5 shrink-0 text-yellow-400" size={16} />
                      {cinema.city}
                    </p>
                    <p
                      className="text-gray-300 mb-4 leading-relaxed"
                      style={{ fontSize: "clamp(11px, 2.8vw, 13px)" }}
                    >
                      {cinema.address}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {(Array.isArray(cinema.phone) ? cinema.phone : []).map((num, idx) => (
                        <p
                          key={idx}
                          className="flex items-center text-white font-medium"
                          style={{ fontSize: "clamp(11px, 2.8vw, 13px)" }}
                        >
                          <Phone className="mr-1.5 shrink-0 text-yellow-400" size={15} />
                          {num}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Social Icons */}
                  {Array.isArray(cinema.social) && cinema.social.length > 0 && (
                    <div className="flex items-center gap-3 mt-5 flex-wrap">
                      {cinema.social.map((s, idx) => {
                        const Icon = ICON_MAP[s.icon?.toLowerCase()];
                        if (!Icon) return null;
                        return (
                          <a
                            key={idx}
                            href={s.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500 hover:text-black transition-all duration-300 hover:scale-110"
                            aria-label={s.icon}
                          >
                            <Icon size={16} />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Neon pulse border */}
                <div className="absolute inset-0 border-2 border-yellow-400/20 rounded-3xl pointer-events-none animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10 sm:mt-12">
          <NavLink to="/cinema">
            <button
              className="group flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 font-semibold text-yellow-400 border-2 border-yellow-400 rounded-full transition-all duration-300 hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_20px_rgba(250,204,21,0.7)]"
              style={{ fontSize: "clamp(13px, 3.5vw, 17px)" }}
            >
              More Cinemas
              <ArrowBigRight
                className="transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110"
                size={20}
              />
            </button>
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default About;
