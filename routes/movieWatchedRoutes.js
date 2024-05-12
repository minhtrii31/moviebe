const express = require("express");
const router = express.Router();
const movieWatchedController = require("../controllers/movieWatchedController");

router.post("/", movieWatchedController.createMovieWatched);

router.put("/:id", movieWatchedController.updateWatchedDuration);

router.get("/:id", movieWatchedController.getWatchedDuration);
router.get(
  "/:userId/:movieId",
  movieWatchedController.getMovieWatchedByUserIdAndMovieId
);

module.exports = router;
