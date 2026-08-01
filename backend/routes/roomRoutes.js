const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createRoom,
  joinRoom,
  getRoom,
} = require("../controllers/roomController");

// Create Room
router.post("/create", protect, createRoom);

// Join Room
router.post("/join", protect, joinRoom);

// Get Room Details
router.get("/:roomCode", protect, getRoom);

module.exports = router;