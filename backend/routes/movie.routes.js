const express = require("express");
const router = express.Router();

const controller = require("../controller/movie.controller");
const {upload } = require("../core/middleware/upload.middleware");
const { validate, movieSchema } = require("../core/validation/movie.validation");

router.post(
  "/",
  upload.single("image"),
  validate(movieSchema),
  controller.create
);

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

router.put(
  "/:id",
  upload.single("image"),
  validate(movieSchema),
  controller.update
);

router.delete("/:id", controller.remove);

module.exports = router;
