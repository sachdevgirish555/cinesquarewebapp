const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      required: true, // uploaded image path
    },
    rating: {
      type: String,
      enum: ["U", "U/A 7+", "U/A 13+", "U/A 16+", "A"],
      required: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    genres: {
      type: [String],
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    newRelease: {
      type: Boolean,
      default: false,
    },
    trailer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);

