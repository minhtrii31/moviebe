const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
require("dotenv").config();

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = decodedToken;
    next();
  });
};

const handleErrors = (res, error) => {
  res.status(500).json({ error: error.message });
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    handleErrors(res, error);
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    handleErrors(res, error);
  }
};

const deletedUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User has been deleted" });
  } catch (error) {
    handleErrors(res, error);
  }
};

const getUserByInfo = async (req, res) => {
  const { username } = req.params;
  try {
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await User.findOne({ username: username });
    const response = {
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      username: user.username,
      email: user.email,
      watched: user.watched,
      favourite: user.favourite,
    };
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.role) {
      return res.status(500).json({ message: "User has no role" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({
        message: "Login successfully",
        token,
        user: { username: user.username, role: user.role },
      });
    } else {
      res.status(401).json({ message: "Wrong password" });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

const register = async (req, res) => {
  const { name, username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      avatar:
        "https://res.cloudinary.com/dprthmqgl/image/upload/v1708944715/avatars/fe4uocps0ibylndvppk9.webp",
      watched: [],
      favourite: [],
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser, token });
  } catch (error) {
    handleErrors(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, email, password, role } = req.body;
    let avatar = null;

    if (req.file) {
      avatar = req.file.path;
    }

    let updatedUser = await User.findById(id);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let updatedFields = {};

    if (name !== undefined && name !== updatedUser.name) {
      updatedFields.name = name;
    }
    if (username !== undefined && username !== updatedUser.username) {
      updatedFields.username = username;
    }
    if (email !== undefined && email !== updatedUser.email) {
      updatedFields.email = email;
    }
    if (password !== undefined) {
      const isPasswordChanged = await bcrypt.compare(
        password,
        updatedUser.password
      );
      if (!isPasswordChanged) {
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        updatedFields.password = hashedPassword;
      }
    }
    if (role !== undefined && role !== updatedUser.role) {
      updatedFields.role = role;
    }
    if (avatar) {
      const cloudinaryResponse = await cloudinary.uploader.upload(avatar);
      updatedFields.avatar = cloudinaryResponse.secure_url;
    }

    if (Object.keys(updatedFields).length > 0) {
      updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
        new: true,
      });
      res.json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.json({ message: "User information remains unchanged" });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

const changePwd = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPwd } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const comparePwd = await bcrypt.compare(newPwd, user.password);
    if (comparePwd) {
      return res.status(400).json({
        error: "The new password must not be the same as the old password",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPwd)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long, containing at least one uppercase letter, one lowercase letter, one digit, and one special character",
      });
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(newPwd, salt);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    handleErrors(res, error);
  }
};

const watchMovie = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.watched.includes(movieId)) {
      return res
        .status(200)
        .json({ error: "Movie already watched and do not push" });
    }

    user.watched.push(movieId);
    await user.save();

    res.status(200).json({ message: "Movie watched successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.favourite.includes(movieId)) {
      return res.status(200).json({ error: "Movie already in favorites" });
    }

    user.favourite.push(movieId);
    await user.save();

    res
      .status(200)
      .json({ message: "Movie added to favorites successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.favourite.includes(movieId)) {
      return res.status(200).json({ error: "Movie not found in favorites" });
    }

    user.favourite = user.favourite.filter(
      (fav) => fav.toString() !== movieId.toString()
    );

    await user.save();

    res
      .status(200)
      .json({ message: "Movie removed from favorites successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const isFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMovieFavorite = user.favourite.includes(movieId);
    res.status(200).json({ isFavorite: isMovieFavorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateRandomPassword = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  const passwordLength = 8;
  let randomPassword = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPassword += characters[randomIndex];
  }
  return randomPassword;
};

const forgotPassword = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPassword = generateRandomPassword();

    const salt = 10;
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "testmail31012002@gmail.com",
      to: user.email,
      subject: "Your New Password",
      text: `Your new password is: ${newPassword}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error occurred while sending email: ", error);
        res.status(500).json({ message: "Failed to send email" });
      } else {
        res.status(200).json({ message: "New password sent to your email" });
      }
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

module.exports = {
  authenticateJWT,
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
};
