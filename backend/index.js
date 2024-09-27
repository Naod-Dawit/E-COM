require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const { signin } = require("./controllers/SigninController");
const { signup, VerifyToken } = require("./controllers/SignupController");
const {
  SendResetToken,
  verifyResetToken,
  resetPasswordFinal,
} = require("./controllers/ResetPasswordController");
const {
  CreatePaymentIntent,
  webhook,
} = require("./controllers/PaymentIntentController");
const { Getdata, ProductById } = require("./controllers/getdataController");

const app = express();

// Raw body parser middleware for Stripe webhook
const rawBodyMiddleware = (req, res, buf) => {
  if (req.originalUrl === "/api/webhook") {
    req.rawBody = buf.toString();
  }
};

// Apply raw body parser middleware
app.use(bodyParser.json({ verify: rawBodyMiddleware }));
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/webhook", webhook);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Other routes
const authenticationToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
app.post("/api/signup", signup);
app.post("/api/verify-token", VerifyToken);
app.post("/api/reset-password", SendResetToken);
app.post("/api/verify-reset-token", verifyResetToken);
app.post("/api/reset-password-final", resetPasswordFinal);
app.post("/api/signin", signin);
app.get("/api/getdata", authenticationToken, Getdata);
app.get("/api/products/:id", ProductById);
app.post("/api/signout", (req, res) => {
  res.status(200).json({ message: "Signout successful!" });
});
app.post(
  "/api/create-payment-intent",
  authenticationToken,
  CreatePaymentIntent
);

// Webhook route should be after applying raw body middleware

// Authentication middleware function

// Connect to MongoDB
const connect = async () => {
  await mongoose
    .connect(process.env.MONGOURL||"mongodb+srv://naod:12345678db@e-com.5wjmq.mongodb.net/?retryWrites=true&w=majority&appName=E-COM")
    .then(() => {
      console.log(`Database connected`);
    })
    .catch((err) => console.error(err));
};
connect();

const _dirname = path.resolve();



if (process.env.NODE_ENV === "production") {
  
  app.use(express.static(path.join(_dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "../frontend", "build", "index.html"));
  });
}

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

module.exports = app;
