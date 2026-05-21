const service = require("../services/movie.service");

const create = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imagePath = `/${req.file.filename}`;
    const movie = await service.createMovie(req.body, imagePath);

    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const movies = await service.getMovies();
    res.json(movies);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const movie = await service.getMovieById(req.params.id);
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const imagePath = req.file ? `/${req.file.filename}` : null;
    const movie = await service.updateMovie(req.params.id, req.body, imagePath);
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await service.deleteMovie(req.params.id);
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};
