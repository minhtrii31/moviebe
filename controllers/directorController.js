const Director = require("../models/directorModel");

exports.createDirector = async (req, res) => {
  try {
    const { name } = req.body;
    const director = new Director({ name });
    await director.save();
    res.status(201).json({ success: true, data: director });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllDirectors = async (req, res) => {
  try {
    const directors = await Director.find();
    res.status(200).json({ success: true, data: directors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDirectorById = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    if (!director) {
      return res
        .status(404)
        .json({ success: false, message: "Director not found" });
    }
    res.status(200).json({ success: true, data: director });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateDirector = async (req, res) => {
  try {
    const { name } = req.body;
    const director = await Director.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!director) {
      return res
        .status(404)
        .json({ success: false, message: "Director not found" });
    }
    res.status(200).json({ success: true, data: director });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteDirector = async (req, res) => {
  try {
    const director = await Director.findByIdAndDelete(req.params.id);
    if (!director) {
      return res
        .status(404)
        .json({ success: false, message: "Director not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Director deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
