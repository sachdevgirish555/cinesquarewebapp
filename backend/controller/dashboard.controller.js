const User = require("../models/user.model");
const Enquiry = require("../models/enquiry.model");
const Movie = require("../models/movie.model");
const CinemaGallery = require("../models/CinemaGallery");

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, enquiries, activeMovies, galleryCollections] = await Promise.all([
      User.countDocuments(),
      Enquiry.countDocuments(),
      Movie.countDocuments(),
      CinemaGallery.find({}, { images: 1, _id: 0 }),
    ]);

    const galleryImages = galleryCollections.reduce(
      (sum, item) => sum + (Array.isArray(item.images) ? item.images.length : 0),
      0
    );

    return res.json({
      success: true,
      data: {
        totalUsers,
        enquiries,
        activeMovies,
        galleryImages,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
