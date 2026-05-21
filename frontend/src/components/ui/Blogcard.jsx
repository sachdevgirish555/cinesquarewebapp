import React from "react";
import { ArrowRight } from "lucide-react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='224' viewBox='0 0 400 224'%3E%3Crect width='400' height='224' fill='%231a1a1a'/%3E%3Crect x='160' y='72' width='80' height='80' rx='8' fill='%23333'/%3E%3Ctext x='200' y='172' text-anchor='middle' fill='%23666' font-size='14' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const BlogCard = ({ image, title, excerpt, date, category }) => {
  return (
    <div className="bg-[#0F0F10] rounded-lg border border-gray-700 shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative">
      {/* Image with category badge */}
      <div className="relative">
        <img
          src={image || PLACEHOLDER}
          alt={title}
          className="w-full h-56 object-cover"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
        />
        <span className="absolute top-3 left-3 bg-yellow-400/50 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 text-left">
        <p className="text-gray-400 text-xs mb-1">{formatDate(date)}</p>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-gray-300 line-clamp-4 mb-4">{excerpt}</p>

        {/* Read More */}
        <button className="flex items-center text-yellow-400 hover:text-yellow-300 font-semibold group">
          Read More
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
