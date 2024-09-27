require("dotenv").config();

const User =require('../models/User')
const nodemailer=require("nodemailer")
const SendResetToken = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const ResetNumber = Math.floor(1000 + Math.random() * 9000);
    user.resetToken = ResetNumber;
    await user.save();
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
      subject: "Reset token for E-COM",
      text: `Your reset token is ${ResetNumber}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending mail:", err);
        return res.status(500).json({ message: "Failed to send email" });
      } else {
        res.status(200).json({ message: "Reset token sent to your email" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const verifyResetToken = async (req, res) => {
  const { email, token } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("Stored Token:", user.resetToken);
    console.log("Input Token:", token);

    if (user.resetToken === token) {
      console.log(true);
    }
    if (user.resetToken == token) {
      return res.status(200).json({ message: "Token is valid" });
    } else {
      return res.status(400).json({ message: "Invalid token" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const resetPasswordFinal = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash the new password

    user.password = newPassword;
    user.resetToken = undefined; // Clear the reset token after use
    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  SendResetToken,
  verifyResetToken,
  resetPasswordFinal,
};
