const fs = require("fs");
const path = require("path");
const Blog = require("../models/blogSchema");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const createBlog = async (data, image) => {
  return Blog.create({ ...data, image });
};

const getBlogs = async () => {
  return Blog.find().sort({ createdAt: -1 });
};

const getBlogById = async (id) => {
  return Blog.findById(id);
};

const updateBlog = async (id, data, image) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new Error("Blog not found");

  // Replace image if new one uploaded
  if (image) {
    if (blog.image) {
      const oldImagePath = path.join(UPLOADS_DIR, blog.image.replace("/", ""));
      fs.existsSync(oldImagePath) && fs.unlinkSync(oldImagePath);
    }
    blog.image = image;
  }

  Object.assign(blog, data);
  return blog.save();
};

const deleteBlog = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new Error("Blog not found");

  if (blog.image) {
    const imagePath = path.join(UPLOADS_DIR, blog.image.replace("/", ""));
    fs.existsSync(imagePath) && fs.unlinkSync(imagePath);
  }

  await blog.deleteOne();
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
