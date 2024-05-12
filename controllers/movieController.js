const Category = require("../models/categoryModel");
const Movie = require("../models/movieModel");

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMovie = async (req, res) => {
  const movie = new Movie(req.body);
  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMovie = async (req, res) => {
  const { id } = req.params;
  const movieUpdate = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, movieUpdate, {
      new: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    await Movie.findByIdAndDelete(id);
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovieBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const movie = await Movie.findOne({ slug: slug });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMoviesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const categoryInDB = await Category.findOne({
      name: { $regex: new RegExp("^" + category + "$", "i") },
    });

    if (!categoryInDB) {
      return res.status(404).json({ message: "Category not found" });
    }

    const movies = await Movie.find({ categories: categoryInDB._id });

    if (!movies || movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found in this category" });
    }

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchMovies = async (req, res) => {
  const { keyword } = req.query;

  try {
    let movies;
    if (keyword && keyword.trim() !== "") {
      const escapedKeyword = escapeRegex(keyword);
      movies = await Movie.find({
        name: { $regex: new RegExp(escapedKeyword, "i") },
      });
    } else {
      movies = await Movie.find();
    }

    if (!movies || movies.length === 0) {
      movies = await Movie.find();
    }

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieBySlug,
  getMoviesByCategory,
  searchMovies,
};
