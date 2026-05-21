const service = require("../services/blog.service");

const create = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    // ✅ Store clean relative URL
    const imagePath = `/${req.file.filename}`;

    const blog = await service.createBlog(req.body, imagePath);
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const blogs = await service.getBlogs();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const blog = await service.getBlogById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const imagePath = req.file ? `/${req.file.filename}` : null;

    const blog = await service.updateBlog(
      req.params.id,
      req.body,
      imagePath
    );

    res.json(blog);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await service.deleteBlog(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
