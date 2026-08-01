const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Test POST Route
app.post("/test", (req, res) => {
  res.json({
    success: true,
    message: "Test route working",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

module.exports = app;