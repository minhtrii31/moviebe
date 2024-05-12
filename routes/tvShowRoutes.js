const express = require("express");
const {
  getAllShows,
  createShow,
  getShowById,
  updateShow,
  deleteShow,
} = require("../controllers/tvShowController");
const router = express.Router();

router.get("/", getAllShows);
router.get("/:id", getShowById);
router.post("/add", createShow);
router.put("/update/:id", updateShow);
router.delete("/delete/:id", deleteShow);

module.exports = router;
