const express = require("express");
const router = express.Router();

const { askAI } = require("../controllers/aiController");

router.post("/", askAI);

module.exports = router;