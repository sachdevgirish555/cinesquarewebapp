const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  addUser,
  loginUser,
  deleteUser,
  getAllUsers,
  getUserById,
} = require("../controller/user.Controller");

// ============================================
// MIDDLEWARE
// ============================================

// Auth Middleware - Protect Routes
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Admin Middleware - Admin Only Access
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
  next();
};

// ============================================
// ROUTES
// ============================================

// Public Routes
router.post("/register", addUser);       // Add User / Register
router.post("/login", loginUser);        // Login User

// Protected Routes (Requires Authentication)
router.get("/getAllUsers", authMiddleware, getAllUsers);              // Get All Users
router.get("/getUserById/:id", authMiddleware, getUserById);           

// Admin Only Routes
router.delete("/:id",  deleteUser);  

module.exports = router;