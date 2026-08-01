const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createRoom
} = require("../controllers/roomController");

router.post("/create", protect, createRoom);

module.exports = router;