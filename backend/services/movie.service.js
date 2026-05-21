const Movie = require("../models/movie.model");
const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
const getStoredFilename = (imagePath = "") =>
  imagePath.replace(/^\/?uploads\//, "").replace(/^\//, "");

const createMovie = async (data, image) => {
  return Movie.create({ ...data, image });
};

const getMovies = async () => {
  return Movie.find().sort({ createdAt: -1 });
};

const getMovieById = async (id) => {
  const movie = await Movie.findById(id);
  if (!movie) throw new Error("Movie not found");
  return movie;
};

const updateMovie = async (id, data, image) => {
  const movie = await Movie.findById(id);
  if (!movie) throw new Error("Movie not found");

  if (image) {
    if (movie.image) {
      const oldPath = path.join(UPLOADS_DIR, getStoredFilename(movie.image));
      fs.promises.unlink(oldPath).catch(() => {});
    }
    movie.image = image;
  }

  const allowed = ["title", "rating", "language", "genres", "year", "newRelease", "trailer"];
  allowed.forEach((field) => {
    if (data[field] !== undefined) movie[field] = data[field];
  });

  return movie.save();
};

const deleteMovie = async (id) => {
  const movie = await Movie.findById(id);
  if (!movie) throw new Error("Movie not found");

  if (movie.image) {
    const imgPath = path.join(UPLOADS_DIR, getStoredFilename(movie.image));
    fs.promises.unlink(imgPath).catch(() => {});
  }

  await movie.deleteOne();
};

module.exports = {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
