const express = require("express");
const router = express.Router();
const {
  getAllUser,
  getUserById,
  deletedUser,
  getUserByInfo,
  login,
  register,
  updateUser,
  changePwd,
  watchMovie,
  addFavorite,
  removeFavorite,
  isFavorite,
  forgotPassword,
} = require("../controllers/userController");
const { uploadCloud } = require("../config/cloudinary");

router.get("/favorite/:userId/:movieId", isFavorite);

router.get("/", getAllUser);

router.get("/:id", getUserById);

router.delete("/delete/:id", deletedUser);

router.get("/info/:username", getUserByInfo);

router.put("/update/:id", uploadCloud.single("avatar"), updateUser);

router.post("/update/password/:id", changePwd);

router.post("/login", login);

router.post("/register", register);

router.post("/watch", watchMovie);

router.post("/add-favorite", addFavorite);

router.post("/remove-favorite", removeFavorite);

router.post("/forgotpassword", forgotPassword);

module.exports = router;
