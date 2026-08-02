const express = require("express");

const router = express.Router();

const {
  saveExecution,
  getHistory,
} = require("../controllers/executionController");

// Save Execution
router.post("/", saveExecution);

// Get History
router.get("/:roomCode", getHistory);

module.exports = router;