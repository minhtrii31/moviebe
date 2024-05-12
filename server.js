const express = require("express");
const { connectToDB } = require("./config/connectToDB");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3131;

connectToDB();

app.use(cors({ credentials: true }));
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const tvShowRoutes = require("./routes/tvShowRoutes");
const directorRoutes = require("./routes/directorRoutes");
const actorRoutes = require("./routes/actorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const commentRoutes = require("./routes/commentRoutes");
const movieWatched = require("./routes/movieWatchedRoutes");

app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/tv-shows/", tvShowRoutes);
app.use("/api/directors", directorRoutes);
app.use("/api/actors", actorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/watched", movieWatched);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
