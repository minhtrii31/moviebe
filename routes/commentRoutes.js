const express = require("express");
const {
  createComment,
  deleteComment,
  getCommentsByMovieId,
} = require("../controllers/commentController");
const router = express.Router();

router.post("/", createComment);
router.delete("/:id", deleteComment);
router.get("/:movieId", getCommentsByMovieId);

module.exports = router;
