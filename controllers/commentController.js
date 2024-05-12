const Comment = require("../models/commentModel");

const createComment = async (req, res) => {
  try {
    const { movieId, content, rate, user } = req.body;
    const comment = new Comment({ movieId, content, rate, user });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommentsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const comments = await Comment.find({ movieId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  deleteComment,
  getCommentsByMovieId,
};
