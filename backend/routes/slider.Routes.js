const express = require("express");
const router = express.Router();
const {upload} = require("../core/middleware/upload.middleware"); // Path to your middleware file
const slideController = require("../controller/slider.Controller");

// POST: Create a slide (uses multer middleware)
// 'img' is the field name you should use in your FormData on the frontend
router.post("/", upload.single("img"), slideController.addSlide);

// GET: Fetch all slides
router.get("/", slideController.getSlides);

// PUT: Edit slide text and/or image
router.put("/:id", upload.single("img"), slideController.updateSlide);

router.delete("/:id", slideController.deleteSlide);

module.exports = router;
