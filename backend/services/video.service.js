const Video = require("../models/video.model");

const createVideo = async (data) => {
  return await Video.create(data);
};

const getAllVideos = async () => {
  return await Video.find().sort({ createdAt: -1 });
};

const getVideoById = async (id) => {
  return await Video.findById(id);
};

const getVideosByCategory = async (category) => {
  return await Video.find({ category }).sort({ createdAt: -1 });
};

const updateVideo = async (id, data) => {
  return await Video.findByIdAndUpdate(id, data, { new: true });
};

const deleteVideo = async (id) => {
  return await Video.findByIdAndDelete(id);
};

module.exports = {
  createVideo,
  getAllVideos,
  getVideoById,
  getVideosByCategory,
  updateVideo,
  deleteVideo,
};