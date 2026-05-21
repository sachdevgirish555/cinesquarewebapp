const express = require("express")
const controller = require("../controller/blog.controller")
const {upload} = require("../core/middleware/upload.middleware")
const adminOnly = require("../core/middleware/admin.middleware")

const router = express.Router()

router.get("/", controller.getAll)
router.get("/:id", controller.getById)

router.post(
  "/",
  
  upload.single("image"),
  controller.create
)

router.put(
  "/:id",
  adminOnly,
  upload.single("image"),
  controller.update
);

router.delete("/:id",  controller.remove)

module.exports = router
