require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

module.exports = connectDB;
