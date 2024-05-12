const MovieWatched = require("../models/movieWatchedModel");

exports.createMovieWatched = async (req, res) => {
  try {
    const { userId, movieId, totalDuration, watchedDuration } = req.body;

    const existingRecord = await MovieWatched.findOne({ userId, movieId });
    if (existingRecord) {
      return res
        .status(200)
        .json({ error: "Movie watched is exist and do not create" });
    }

    const movieWatched = await MovieWatched.create({
      userId,
      movieId,
      totalDuration,
      watchedDuration,
    });
    res.status(201).json(movieWatched);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateWatchedDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const { watchedDuration, totalDuration } = req.body;
    const movieWatched = await MovieWatched.findByIdAndUpdate(
      id,
      { watchedDuration, totalDuration },
      { new: true }
    );
    if (!movieWatched) {
      return res.status(404).json({ error: "MovieWatched not found" });
    }
    res.json(movieWatched);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getWatchedDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const movieWatched = await MovieWatched.findById(id);
    if (!movieWatched) {
      return res.status(404).json({ error: "MovieWatched not found" });
    }
    res.json({ watchedDuration: movieWatched.watchedDuration });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMovieWatchedByUserIdAndMovieId = async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    const movieWatched = await MovieWatched.findOne({ userId, movieId });
    if (!movieWatched) {
      return res.status(404).json({ error: "MovieWatched not found" });
    }
    res.json(movieWatched);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
