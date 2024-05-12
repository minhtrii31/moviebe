const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema({
  episode_number: { type: Number, required: true },
  name: String,
  source_url: { type: String, required: true },
});

const showSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    content: String,
    status: { type: String, enum: ["released", "upcoming", "cancelled"] },
    poster_url: String,
    thumb_url: String,
    trailer_url: String,
    quality: { type: String, enum: ["SD", "HD", "FullHD"] },
    year: Number,
    view: { type: Number, default: 0 },
    actor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
    director: [{ type: mongoose.Schema.Types.ObjectId, ref: "Director" }],
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    country: String,
    season: { type: Number, default: 1 },
    episode: { type: Number, default: 1 },
    network: String,
    episodes: [episodeSchema],
  },
  { timestamps: true }
);

const Show = mongoose.model("Show", showSchema);

module.exports = Show;
