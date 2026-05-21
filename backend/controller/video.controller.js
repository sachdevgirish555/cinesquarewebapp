const videoService = require("../services/video.service");
const fs = require("fs");
const path = require("path");

// Add Video
const addVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    if (!req.body.category) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Category is required" });
    }

    const videoPath = `/${req.file.filename}`;

    const videoData = {
      video: videoPath,
      category: req.body.category,
    };

    const video = await videoService.createVideo(videoData);
    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: video,
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// Get All Videos
const getVideos = async (req, res, next) => {
  try {
    const videos = await videoService.getAllVideos();
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};


const getVideo = async (req, res, next) => {
  try {
    const video = await videoService.getVideoById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// Get Videos by Category
const getVideosByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const videos = await videoService.getVideosByCategory(category);

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

// Update Video
const updateVideo = async (req, res, next) => {
  try {
    const video = await videoService.getVideoById(req.params.id);

    if (!video) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const updateData = {};

    // Update category if provided
    if (req.body.category) {
      updateData.category = req.body.category;
    }

    // Update video file if new one is uploaded
    if (req.file) {
      // Delete old video file
      const oldFilename = path.basename(video.video);
      const oldFilePath = path.join(process.cwd(), "uploads", oldFilename);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log("Old video deleted:", oldFilePath);
      }

      updateData.video = `/${req.file.filename}`;
    }

    const updatedVideo = await videoService.updateVideo(req.params.id, updateData);

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: updatedVideo,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// Delete Video
const deleteVideo = async (req, res, next) => {
  try {
    const video = await videoService.getVideoById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Delete video file from uploads folder
    if (video.video) {
      const filename = path.basename(video.video);
      const filePath = path.join(process.cwd(), "uploads", filename);

      console.log("=== DELETE VIDEO DEBUG ===");
      console.log("video.video:", video.video);
      console.log("filename:", filename);
      console.log("filePath:", filePath);
      console.log("File exists:", fs.existsSync(filePath));

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("✅ Video file deleted successfully");
      } else {
        console.log("❌ Video file not found at path:", filePath);
      }
    }

    // Delete from database
    await videoService.deleteVideo(req.params.id);

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addVideo,
  getVideos,
  getVideo,
  getVideosByCategory,
  updateVideo,
  deleteVideo,
};