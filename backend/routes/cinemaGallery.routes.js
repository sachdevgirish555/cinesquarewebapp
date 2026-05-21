const express = require("express");
const router = express.Router();

const { upload } = require("../core/middleware/upload.middleware");
const {
  createGallery,
  getGalleryByCinema,
  deleteGallery,
  getGallery,
} = require("../controller/cinemaGallery.Controller");

// ✅ Add gallery images to cinema
router.get("/", getGallery); // all galleries
router.get("/cinema/:cinemaId", getGalleryByCinema);
router.post("/", upload.array("images", 20), createGallery);
router.delete("/:id", deleteGallery);

module.exports = router;