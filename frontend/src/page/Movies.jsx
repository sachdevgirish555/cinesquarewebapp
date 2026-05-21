import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Filter, Search, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getMovies } from "../features/movies/movieSlice";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%231a1a1a'/%3E%3Ctext x='200' y='300' text-anchor='middle' fill='%23555' font-size='20' font-family='sans-serif'%3ENo Poster%3C/text%3E%3C/svg%3E";

export const getImageUrl = (imageName) => {
  if (!imageName) return PLACEHOLDER_IMG;
  const BASE_URL = "https://backend.cinesquare.in/uploads";
  return `${BASE_URL}/${encodeURIComponent(imageName.replace(/^\/+/, ""))}`;
};

const getTrailerEmbedUrl = (trailerUrl) => {
  if (!trailerUrl) return null;

  try {
    const url = new URL(trailerUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        const videoId = url.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      if (url.pathname.startsWith("/embed/")) {
        return trailerUrl;
      }

      if (url.pathname.startsWith("/shorts/")) {
        const videoId = url.pathname.split("/")[2];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
    }

    return null;
  } catch {
    return null;
  }
};

// Extract 4-digit year from "2026-04-22" or legacy "2026"
const getMovieYear = (year) => {
  if (!year) return null;
  const match = String(year).match(/^(\d{4})/);
  return match ? match[1] : null;
};

// Format year field → "22 Apr 2026" if full date, else return as-is
const formatMovieDate = (year) => {
  if (!year) return "-";
  if (/^\d{4}-\d{2}-\d{2}/.test(year)) {
    return new Date(year).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return year;
};

const Movies = () => {
  const dispatch = useDispatch();
  const { movies } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(getMovies());
  }, [dispatch]);

  const [yearFilter, setYearFilter] = useState("All");
  const [newFilter, setNewFilter] = useState("All");
  const [langFilter, setLangFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const selectedTrailerEmbedUrl = getTrailerEmbedUrl(selectedTrailer);

  const availableYears = [...new Set(movies.map((m) => getMovieYear(m.year)))]
    .filter(Boolean)
    .sort((a, b) => Number(b) - Number(a));

  const availableLanguages = [...new Set(movies.map((m) => m.language))].filter(Boolean);

  const filteredMovies = movies.filter((movie) => {
    const title = movie.title || "";
    const matchSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter === "All" || getMovieYear(movie.year) === String(yearFilter);
    const matchNew =
      newFilter === "All" ||
      (newFilter === "New" && movie.newRelease) ||
      (newFilter === "Old" && !movie.newRelease);
    const matchLang = langFilter === "All" || movie.language === langFilter;

    return matchSearch && matchYear && matchNew && matchLang;
  });

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        {/* Filter Bar */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex items-center gap-2 text-yellow-400 font-semibold text-lg">
            <Filter size={20} /> Filter Movies
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/80 border border-yellow-400/40 pl-10 pr-4 py-2 rounded-xl text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-black/80 border border-yellow-400/40 px-4 py-2 rounded-xl text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Years</option>
              {availableYears.map((year, idx) => (
                <option key={idx} value={year}>{year}</option>
              ))}
            </select>

            {/* New / Old */}
            <select
              value={newFilter}
              onChange={(e) => setNewFilter(e.target.value)}
              className="bg-black/80 border border-yellow-400/40 px-4 py-2 rounded-xl text-white focus:outline-none"
            >
              <option value="All">All</option>
              <option value="New">New Release</option>
              <option value="Old">Old</option>
            </select>

            {/* Language Filter */}
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="bg-black/80 border border-yellow-400/40 px-4 py-2 rounded-xl text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Languages</option>
              {availableLanguages.map((lang, idx) => (
                <option key={idx} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Movie Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-500/30 transition-all duration-500 cursor-pointer"
              >
                <img
                  src={getImageUrl(movie.image)}
                  alt={movie.title || "Movie"}
                  className="w-full h-96 object-cover"
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <button
                    type="button"
                    onClick={() => setSelectedTrailer(movie.trailer || null)}
                    disabled={!movie.trailer}
                    className="bg-yellow-400 text-black p-4 rounded-full hover:scale-110 transition-transform disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Play className="w-6 h-6" />
                  </button>
                </div>

                {/* Movie Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold">{movie.title}</h3>

                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="bg-yellow-400 text-black px-2 py-1 rounded-md font-semibold">
                      {movie.rating}
                    </span>
                    <span className="text-gray-300 italic">
                      {movie.language}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {Array.isArray(movie.genres) && movie.genres.map((genre, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-white/10 rounded-md backdrop-blur-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                    {/* Renders "22 Apr 2026" for full dates, plain year for legacy */}
                    <span>{formatMovieDate(movie.year)}</span>
                    {movie.newRelease && (
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-[10px] font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-20 text-lg">
            No movies found 😔
          </p>
        )}
      </div>

      {/* Trailer Modal */}
      {selectedTrailer && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedTrailer(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-[90%] md:w-[80%] lg:w-[70%] aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedTrailerEmbedUrl ? (
              <iframe
                src={selectedTrailerEmbedUrl}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-lg font-semibold text-white">
                  This trailer cannot be embedded here.
                </p>
                <a
                  href={selectedTrailer}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:bg-yellow-300"
                >
                  Open Trailer on YouTube
                </a>
              </div>
            )}

            <button
              onClick={() => setSelectedTrailer(null)}
              className="absolute -top-10 right-0 text-white hover:text-yellow-400 transition"
            >
              <X size={32} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Movies;
