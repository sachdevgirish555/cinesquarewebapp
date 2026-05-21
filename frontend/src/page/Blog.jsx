import React, { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import BlogCard from "../components/ui/Blogcard";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../features/Blog/blogSlice";

export const getImageUrl = (imageName) => {
  if (!imageName) return "";
  const BASE_URL = "https://backend.cinesquare.in/uploads";
  return `${BASE_URL}/${encodeURIComponent(imageName.replace(/^\/+/, ""))}`;
};

const Blog = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pb-20 pt-36">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-textColor text-center mb-12"
        >
          News &amp; Blogs
        </motion.h1>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Blog Cards */}
        {!loading && blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, idx) => (
              <NavLink to={`/blog-details/${post._id}`} key={idx}>
                <motion.div
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Suspense
                    fallback={
                      <div className="h-64 bg-gray-800 animate-pulse rounded-xl" />
                    }
                  >
                    <BlogCard
                      image={getImageUrl(post.image)}
                      title={post.title}
                      excerpt={post.excerpt}
                      date={post.date}
                      category={post.category}
                    />
                  </Suspense>
                </motion.div>
              </NavLink>
            ))}
          </div>
        ) : !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🎬</span>
            </div>
            <p className="text-gray-400 text-lg">No blogs available yet.</p>
            <p className="text-gray-600 text-sm mt-2">Check back soon for updates!</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Blog;
