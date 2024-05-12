const express = require("express");
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieBySlug,
  getMoviesByCategory,
  searchMovies,
} = require("../controllers/movieController");
const router = express.Router();

router.get("/search", searchMovies);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.get("/category/:category", getMoviesByCategory);
router.get("/slug/:slug", getMovieBySlug);
router.post("/add", createMovie);
router.put("/update/:id", updateMovie);
router.delete("/delete/:id", deleteMovie);

module.exports = router;
