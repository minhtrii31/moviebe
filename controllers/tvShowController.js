const Show = require("../models/tvShowModel");

const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find();
    res.status(200).json(shows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createShow = async (req, res) => {
  const show = new Show(req.body);

  try {
    const newShow = await show.save();
    res.status(201).json(newShow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ message: "TV show not found" });
    }
    res.status(200).json(show);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!show) {
      return res.status(404).json({ message: "TV show not found" });
    }
    res.status(200).json(show);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ message: "TV show not found" });
    }
    res.status(204).json();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllShows,
  createShow,
  getShowById,
  updateShow,
  deleteShow,
};
