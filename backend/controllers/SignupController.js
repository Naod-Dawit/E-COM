require("dotenv").config();


const User=require("../models/User");
const jwt=require("jsonwebtoken");
const nodemailer=require("nodemailer");

const signup = async (req, res) => {
  const { email, password, name, age } = req.body;

  try {
    const verificationNumber = Math.floor(1000 + Math.random() * 9000);

    const newUser = new User({
      email,
      password,
      name,
      age,
      verified: false,
      VerificationToken: verificationNumber,
    });

    await newUser.save();

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verification token for E-COM",
      text: `Your verification token is ${verificationNumber}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(`Error sending mail`, err);
      } else {
        console.log(`Mail sent`, info.response);
      }
    });

    const token = jwt.sign(
      { email: newUser.email },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(201).json({
      message: "User created successfully! Please verify your email.",
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const VerifyToken= async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.VerificationToken === token) {
      user.verified = true;
      await user.save();

      return res.status(200).json({ message: "User verified successfully!" });
    } else {
      return res.status(400).json({ message: "Invalid verification token" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
module.exports={signup,VerifyToken}