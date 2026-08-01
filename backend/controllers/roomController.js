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

const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    // Check if room code is provided
    if (!roomCode) {
      return res.status(400).json({
        success: false,
        message: "Room code is required.",
      });
    }

    // Find room
    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    // Check if user is already a member
const alreadyJoined = room.members.some(
  (member) => member.toString() === req.user._id.toString()
);

if (alreadyJoined) {
  return res.status(400).json({
    success: false,
    message: "You are already in this room.",
  });
}

room.members.push(req.user._id);

await room.save();

    return res.status(200).json({
      success: true,
      message: "JOined room successfully.",
      room,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const room = await Room.findOne({ roomCode })
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    return res.status(200).json({
      success: true,
      room,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getRoom,
};