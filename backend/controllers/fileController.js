const File = require("../models/File");

// =====================
// Create File / Folder
// =====================
const createFile = async (req, res) => {
  try {

    const file = await File.create({
      roomCode: req.body.roomCode,
      fileName: req.body.fileName,

      type: req.body.type || "file",

      parentId: req.body.parentId || null,

      language: req.body.language || "javascript",

      code: req.body.code || "",
    });

    res.status(201).json({
      success: true,
      file,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to create item",
    });

  }
};


// =====================
// Get All Files of Room
// =====================
const getFiles = async (req, res) => {
  try {
    const files = await File.find({
      roomCode: req.params.roomCode,
    });

    res.json({
      success: true,
      files,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch files",
    });
  }
};

// =====================
// Get Single File
// =====================
const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.json({
      success: true,
      file,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch file",
    });
  }
};

// =====================
// Update File
// =====================
const updateFile = async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.json({
      success: true,
      file,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to update file",
    });
  }
};

// =====================
// Delete File
// =====================
const deleteFile = async (req, res) => {
  try {

    const file = await File.findByIdAndDelete(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.json({
      success: true,
      message: "File deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to delete file",
    });

  }
};

module.exports = {
  createFile,
  getFiles,
  getFile,
  updateFile,
  deleteFile,
};

