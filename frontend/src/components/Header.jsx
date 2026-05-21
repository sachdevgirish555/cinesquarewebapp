import { motion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import Navbar from "./Navbar";
import { useEffect, useRef, useState } from "react";

const Header = ({ heading, BgVideo, para }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.volume = volume;
    video.play().catch(() => {});
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
    setIsPlaying(!video.paused);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = val;
    video.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[85vh] lg:h-screen">
        {/* Video */}
        <video
          ref={videoRef}
          src={BgVideo}
          autoPlay
          loop
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay (better readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>

        {/* Controls */}
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2 sm:gap-3 bg-black/50 backdrop-blur-sm px-3 py-2 sm:px-4 rounded-full border border-yellow-400/20">
          <button
            onClick={togglePlay}
            className="text-yellow-400 hover:text-yellow-300"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={toggleMute}
            className="text-yellow-400 hover:text-yellow-300"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Hide on small screens */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="hidden sm:block w-20 accent-yellow-400 cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col md:flex-row items-center justify-center md:justify-between px-4 sm:px-6 md:px-10 gap-6 sm:gap-10">
          {/* Left Content */}
          <div className="text-center md:text-left max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 uppercase tracking-wide sm:tracking-widest"
            >
              {heading}
            </motion.h1>

            <p className="text-white mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed">
              {para}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
