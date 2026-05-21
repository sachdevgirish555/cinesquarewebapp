import React, { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../features/Blog/blogSlice";

// ✅ Lazy load component
const BlogCard = lazy(() => import("./ui/Blogcard"));

export const getImageUrl = (imageName) => {
  if (!imageName) return "";
  const BASE_URL = "https://backend.cinesquare.in/uploads";
  return `${BASE_URL}/${encodeURIComponent(imageName.replace(/^\/+/, ""))}`;
};

const News = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  /* Animations */
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-primary py-20 overflow-hidden">
      {/* Title */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="text-textColor font-bold text-5xl">NEWS & BLOGS</h1>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* ✅ Single Suspense wrapper */}
        <Suspense
          fallback={
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 animate-pulse rounded-xl"
                />
              ))}
            </>
          }
        >
          {blogs.slice(0, 3).map((post) => (
            <NavLink key={post._id} to={`/blog-details/${post._id}`}>
              <motion.div variants={cardVariants}>
                <BlogCard
                  image={getImageUrl(post.image)}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.createdAt || post.date}
                  category={post.category}
                />
              </motion.div>
            </NavLink>
          ))}
        </Suspense>
      </motion.div>

      {/* Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <NavLink to="/blog">
          <button className="text-textColor border border-textColor py-2 px-6 flex items-center gap-2 hover:bg-primary hover:text-white transition-all duration-300 rounded-md">
            View All Articles <ArrowRight className="w-5 h-5" />
          </button>
        </NavLink>
      </motion.div>
    </div>
  );
};

export default News;
