const mongoose = require("mongoose");

const directorSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Director = mongoose.model("Director", directorSchema);

module.exports = Director;
