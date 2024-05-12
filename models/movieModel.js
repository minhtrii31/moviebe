const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    content: String,
    status: { type: String, enum: ["released", "upcoming", "cancelled"] },
    poster_url: String,
    thumb_url: String,
    trailer_url: String,
    source_url: String,
    time: String,
    quality: { type: String, enum: ["SD", "HD", "FullHD"] },
    year: Number,
    view: { type: Number, default: 0 },
    actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
    director: [{ type: mongoose.Schema.Types.ObjectId, ref: "Director" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    country: String,
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
