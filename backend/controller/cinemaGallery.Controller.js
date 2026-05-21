const fs = require("fs");
const Cinema = require("../models/cinema.model");
const CinemaGallery = require("../models/CinemaGallery");


// ✅ CREATE GALLERY
exports.createGallery = async (req, res) => {
  try {
    const { cinemaId } = req.body;

    // const cinemaExists = await Cinema.findById(cinemaId);
    // if (!cinemaExists) {
    //   return res.status(404).json({ message: "Cinema not found" });
    // }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image required" });
    }

    const imagePaths = req.files.map(file => `/${file.filename}`);

    const gallery = await CinemaGallery.create({
      cinema: cinemaId,
      images: imagePaths,
    });

    res.status(201).json({
      success: true,
      message: "Gallery added successfully",
      data: gallery,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ✅ GET GALLERY BY CINEMA
exports.getGalleryByCinema = async (req, res) => {
  try {
    const galleries = await CinemaGallery.find({
      cinema: req.params.cinemaId,
    });

    res.json({
      success: true,
      data: galleries,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const galleries = await CinemaGallery.find({});

    res.json({
      success: true,
      data: galleries,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// ✅ DELETE GALLERY
exports.deleteGallery = async (req, res) => {
  try {
    const gallery = await CinemaGallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    // delete images from folder
    gallery.images.forEach(img => {
      if (fs.existsSync(img)) {
        fs.unlinkSync(img);
      }
    });

    await gallery.deleteOne();

    res.json({
      success: true,
      message: "Gallery deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};