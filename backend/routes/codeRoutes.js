const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { runCode } = require("../controllers/codeController");

router.post("/run", protect, runCode);

module.exports = router;