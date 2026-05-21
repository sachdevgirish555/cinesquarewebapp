import React, { useEffect } from "react";
import { Calendar, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { getBlogById } from "../features/Blog/blogSlice";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%231a1a1a'/%3E%3Ctext x='400' y='210' text-anchor='middle' fill='%23555' font-size='20' font-family='sans-serif'%3ENo Image Available%3C/text%3E%3C/svg%3E";

const getImageUrl = (imageName) => {
  if (!imageName) return PLACEHOLDER;
  const BASE_URL = "https://backend.cinesquare.in/uploads";
  return `${BASE_URL}/${encodeURIComponent(imageName.replace(/^\/+/, ""))}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const BlogDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedBlog, blogDetailsLoading, blogDetailsError } = useSelector(
    (state) => state.blogs,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (id) dispatch(getBlogById(id));
  }, [dispatch, id]);

  const title = selectedBlog?.title || "Loading blog...";
  const date = selectedBlog?.createdAt || selectedBlog?.date || "";
  const category = selectedBlog?.category || "";
  const imageUrl = getImageUrl(selectedBlog?.image);
  const content =
    selectedBlog?.excerpt ||
    selectedBlog?.description ||
    "Blog content is loading.";

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-textColor text-black px-4 py-2 rounded-full hover:bg-white transition-all duration-300 shadow-lg mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {blogDetailsLoading ? (
          /* Skeleton Loader */
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-1/4" />
            <div className="h-8 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-1/4" />
            <div className="h-48 sm:h-64 md:h-80 bg-white/10 rounded-2xl" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-white/10 rounded" />
              ))}
            </div>
          </div>
        ) : blogDetailsError ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl">{blogDetailsError}</p>
          </div>
        ) : (
          <>
            {/* Category + Date */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {category && (
                <span className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  {category}
                </span>
              )}
              {date && (
                <span className="inline-flex items-center gap-1.5 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatDate(date)}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textColor border-l-4 border-textColor pl-4 mb-8 leading-snug">
              {title}
            </h1>

            {/* Image */}
            <div className="w-full mb-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
            </div>

            {/* Content */}
            <p className="text-gray-300 leading-relaxed text-justify whitespace-pre-line text-base sm:text-lg">
              {content}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
