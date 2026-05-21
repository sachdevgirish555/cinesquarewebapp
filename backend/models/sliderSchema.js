const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
  img: { type: String, required: true }, 
  text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Slide", slideSchema);