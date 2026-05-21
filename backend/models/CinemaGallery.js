const mongoose = require("mongoose");

const cinemaGallerySchema = new mongoose.Schema(
  {
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
    },

    images: {
      type: [String], // multiple images
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CinemaGallery", cinemaGallerySchema);