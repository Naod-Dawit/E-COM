require("dotenv").config();

const express = require("express");
const stripe = require("stripe")(process.env.SECRET_KEY);
const User = require("../models/User");
const nodemailer = require("nodemailer");
const app = express();
const bodyParser = require("body-parser");

// Function to format items as a readable string
const formatItems = (items) => {
  return items
    .map((item) => {
      const name = item.name || "Unknown item";
      const quantity = item.quantity || 1;
      const price = item.price !== undefined ? `$${item.price}` : "N/A";
      return `- ${name} (x${quantity}) - ${price}`;
    })
    .join("\n");
};

// Function to send payment notification email
const sendPaymentNotification = async (paymentInfo) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const recipientEmail =
    paymentInfo.customerEmail !== "N/A"
      ? paymentInfo.customerEmail
      : "default@example.com";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "New Payment Received",
    text: `Hello ${paymentInfo.customerName},

A new payment has been successfully processed. Below are the details of the transaction:

Amount Paid: $${paymentInfo.amount.toFixed(2)}

Items Purchased:
${
  paymentInfo.items.length > 0
    ? formatItems(paymentInfo.items)
    : "No items available"
}

If you have any questions regarding your order, feel free to reach out to our support team.

Thank you for shopping with us!

Best regards,
[Your Company Name]`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
// Function to create a payment intent
const CreatePaymentIntent = async (req, res) => {
  const { amount, items } = req.body;
  

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        items: JSON.stringify(items),
        email: req.user.email,
      },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Stripe webhook handler
const webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_ENDPOINT_SECRET
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res
      .status(400)
      .send(`⚠️  Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const userEmail = paymentIntent.metadata.email;

    // Fetch user details from your database
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.error("User not found:", userEmail);
      return res.status(404).send("User not found");
    }

    const paymentInfo = {
      amount: paymentIntent.amount / 100,
      customerEmail: user.email,
      customerName: user.name,
      items: paymentIntent.metadata.items
        ? JSON.parse(paymentIntent.metadata.items)
        : [],
    };

    await sendPaymentNotification(paymentInfo);
  }

  res.status(200).json({ type: "application/json" });
};

// Export the functions
module.exports = {
  CreatePaymentIntent,
  webhook,
};
