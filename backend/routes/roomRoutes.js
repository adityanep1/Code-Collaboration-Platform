const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createRoom,
  joinRoom,
  getRoom,
  saveCode,
} = require("../controllers/roomController");

// Create Room
router.post("/create", protect, createRoom);

// Join Room
router.post("/join", protect, joinRoom);

// Get Room Details
router.get("/:roomCode", protect, getRoom);

// Save Code
router.post("/save",protect,saveCode);

module.exports = router;