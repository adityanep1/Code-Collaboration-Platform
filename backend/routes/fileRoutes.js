const express = require("express");

const router = express.Router();

const {
  createFile,
  getFiles,
  getFile,
  updateFile,
  moveFile,
  deleteFile,
  importProject,
} = require("../controllers/fileController");

router.post("/", createFile);

router.get("/single/:id", getFile);

router.get("/:roomCode", getFiles);

router.put("/:id", updateFile);

router.put("/move/:id", moveFile);

router.delete("/:id", deleteFile);

router.post("/import", importProject);

module.exports = router;