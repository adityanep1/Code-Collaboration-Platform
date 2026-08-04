const express = require("express");

const router = express.Router();

const {
  createFile,
  getFiles,
  getFile,
  updateFile,
  deleteFile,
} = require("../controllers/fileController");

router.post("/", createFile);

router.get("/single/:id", getFile);

router.get("/:roomCode", getFiles);

router.put("/:id", updateFile);

router.delete("/:id", deleteFile);

module.exports = router;