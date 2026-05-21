const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const controller = require("../controller/enquiry.controller");
const {
  validate,
  enquirySchema,
  enquiryUpdateSchema,
  bulkDeleteEnquirySchema,
} = require("../middlewares/enquiry.validate");

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

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
  next();
};

// CREATE
router.post("/", validate(enquirySchema), controller.create);

// ADMIN EMAIL CONFIG
router.get("/email-config", authMiddleware, adminMiddleware, controller.getEmailConfig);
router.put("/email-config", authMiddleware, adminMiddleware, controller.updateEmailConfig);

router.get("/", controller.getAll);
// BULK DELETE - must come before /:id route
router.delete("/bulk", validate(bulkDeleteEnquirySchema), controller.bulkRemove);
// SPECIFIC ROUTES
router.get("/category/:category", controller.getByCategory);
router.get("/:id", controller.getById);
router.put("/:id", validate(enquiryUpdateSchema), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
