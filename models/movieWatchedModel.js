const mongoose = require("mongoose");

const movieWatchedSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    totalDuration: Number,
    watchedDuration: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MovieWatched", movieWatchedSchema);
