const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connectString = process.env.DB_URL;

const connectToDB = async () => {
  try {
    await mongoose.connect(connectString);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
};

module.exports = {
  connectToDB,
};
