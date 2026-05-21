const express = require("express");
const router = express.Router();
const videoController = require("../controller/video.controller");
const { uploadVideo } = require("../core/middleware/upload.middleware");

// POST - Add new video
router.post("/", uploadVideo.single("video"), videoController.addVideo);

// GET - Get all videos
router.get("/", videoController.getVideos);

// GET - Get single video by ID
router.get("/:id", videoController.getVideo);

// GET - Get videos by category
router.get("/category/:category", videoController.getVideosByCategory);

// PUT - Update video
router.put("/:id", uploadVideo.single("video"), videoController.updateVideo);

// DELETE - Delete video
router.delete("/:id", videoController.deleteVideo);

module.exports = router;