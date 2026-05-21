const Slide = require("../models/sliderSchema");

const createSlide = async (data) => {
  return await Slide.create(data);
};

const getAllSlides = async () => {
  return await Slide.find();
};

const getSlideById = async (id) => {
  return await Slide.findById(id);
};

const updateSlide = async (id, data) => {
  return await Slide.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteSlide = async (id) => {
  return await Slide.findByIdAndDelete(id);
};

module.exports = {
  createSlide,
  getAllSlides,
  getSlideById,
  updateSlide,
  deleteSlide,
};
