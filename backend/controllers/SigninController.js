require("dotenv").config();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res
        .status(400)
        .json({ message: "Invalid email or password. Please try again." });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      console.log("Password does not match");
      return res
        .status(400)
        .json({ message: "Invalid email or password. Please try again." });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET
    );

    console.log("Signin successful");
    res.status(200).json({ message: "Signin successful!", token });
  } catch (err) {
    console.error("Error during signin:", err);
    res.status(500).json({
      error: "An error occurred during signin. Please try again later.",
    });
  }
};

module.exports={signin}