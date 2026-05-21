const slideService = require("../services/slider.service");
const fs = require("fs");
const path = require("path");

const deleteUploadedFile = (storedPath) => {
  if (!storedPath) return;

  const filename = path.basename(storedPath);
  const filePath = path.join(process.cwd(), "uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const addSlide = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const slideData = {
      text: req.body.text,
      img: `/${req.file.filename}`,
    };

    const slide = await slideService.createSlide(slideData);
    res.status(201).json(slide);
  } catch (error) {
    next(error);
  }
};

const getSlides = async (req, res, next) => {
  try {
    const slides = await slideService.getAllSlides();
    res.status(200).json(slides);
  } catch (error) {
    next(error);
  }
};

const updateSlide = async (req, res, next) => {
  try {
    const slide = await slideService.getSlideById(req.params.id);

    if (!slide) {
      if (req.file) {
        deleteUploadedFile(req.file.filename);
      }

      return res.status(404).json({ message: "Slide not found" });
    }

    const updateData = {};

    if (req.body.text !== undefined) {
      updateData.text = req.body.text;
    }

    if (req.file) {
      deleteUploadedFile(slide.img);
      updateData.img = `/${req.file.filename}`;
    }

    const updatedSlide = await slideService.updateSlide(req.params.id, updateData);
    res.status(200).json(updatedSlide);
  } catch (error) {
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }

    next(error);
  }
};

const deleteSlide = async (req, res, next) => {
  try {
    const slide = await slideService.getSlideById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    deleteUploadedFile(slide.img);
    await slideService.deleteSlide(req.params.id);

    res.json({ message: "Slide and associated image deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    next(error);
  }
};

module.exports = {
  addSlide,
  getSlides,
  updateSlide,
  deleteSlide,
};
