const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  video: { type: String, required: true }, 
  category: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Video", videoSchema);