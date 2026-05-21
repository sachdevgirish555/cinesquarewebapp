const fs = require("fs");
const path = require("path");
const Cinema = require("../models/cinema.model");


// ✅ CREATE CINEMA
exports.createCinema = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const cinema = await Cinema.create({
      ...req.body,
      img: `/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Cinema created successfully",
      data: cinema,
    });
  } catch (error) {
    console.error("Create Cinema Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.getCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cinemas.length,
      data: cinemas,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ✅ GET SINGLE CINEMA
exports.getCinemaById = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    res.json({ success: true, data: cinema });
  } catch (error) {
    res.status(500).json({ success: false, message: "Invalid ID" });
  }
};


// ✅ UPDATE CINEMA (with optional image replace)
exports.updateCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    // ✅ If new image uploaded → delete old image
    if (req.file) {
      if (cinema.img && fs.existsSync(path.join('uploads', cinema.img))) {
        fs.unlinkSync(path.join('uploads', cinema.img));
      }
      cinema.img = `/${req.file.filename}`;
    }

    // ✅ Update other fields
    Object.assign(cinema, req.body);

    await cinema.save();

    res.json({
      success: true,
      message: "Cinema updated successfully",
      data: cinema,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ✅ DELETE CINEMA
exports.deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    // ✅ Delete image from uploads folder
    if (cinema.img && fs.existsSync(path.join('uploads', cinema.img))) {
      fs.unlinkSync(path.join('uploads', cinema.img));
    }

    await cinema.deleteOne();

    res.json({
      success: true,
      message: "Cinema deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};