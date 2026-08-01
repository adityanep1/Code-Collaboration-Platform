const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");

const createRoom = async (req, res) => {
  try {
    const { roomName, language } = req.body;

    // Validate input
    if (!roomName) {
      return res.status(400).json({
        success: false,
        message: "Room name is required.",
      });
    }

    // Generate a unique room code
    const roomCode = uuidv4().substring(0, 6).toUpperCase();

    // Create room
    const room = await Room.create({
      roomName,
      roomCode,
      language: language || "javascript",
      owner: req.user._id,
      members: [req.user._id],
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully.",
      room,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRoom,
};