const express = require("express");
const router = express.Router();

const { upload } = require("../core/middleware/upload.middleware");
const { cinemaSchema, validate } = require("../core/validation/cinemaValidator");

const {
  createCinema,
  getCinemas,
  getCinemaById,
  updateCinema,
  deleteCinema,
} = require("../controller/cinema.controller");


// ✅ CREATE
router.post(
  "/",
  upload.single("img"),
  validate(cinemaSchema),
  createCinema
);


// ✅ GET ALL
router.get("/", getCinemas);


// ✅ GET SINGLE
router.get("/:id", getCinemaById);


// ✅ UPDATE
router.put(
  "/:id",
  upload.single("img"),
  validate(cinemaSchema),
  updateCinema
);


// ✅ DELETE
router.delete("/:id", deleteCinema);


module.exports = router;