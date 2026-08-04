const express = require("express");
const cors = require("cors");

const app = express();

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const codeRoutes = require("./routes/codeRoutes");
const executionRoutes = require("./routes/executionRoutes");
const fileRoutes = require("./routes/fileRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/files", fileRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.post("/test", (req, res) => {
  res.json({
    success: true,
    message: "Test route working",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/executions", executionRoutes);
app.use("/api/files", fileRoutes);

module.exports = app;