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
// Import Project
// =====================
const importProject = async (req, res) => {
  try {

    const { roomCode, files } = req.body;

    if (!roomCode || !files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid project data",
      });
    }

    const documents = files.map((file) => ({

      roomCode,

      fileName: file.fileName,

      path: file.path,

      extension: file.extension,

      size: file.size,

      code: file.code,

      type: "file",

      language: file.extension,

    }));

    await File.insertMany(documents);

    res.json({
      success: true,
      message: "Project Imported Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
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
// Move File / Folder
// =====================
const moveFile = async (req, res) => {
  try {

    const { parentId } = req.body;

    const file = await File.findByIdAndUpdate(
      req.params.id,
      {
        parentId: parentId || null,
      },
      {
        returnDocument: "after",
      }
    );

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
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
      message: error.message,
    });

  }
};


// =====================
// Rename File / Folder
// =====================
const renameFile = async (req, res) => {
  try {

    const file = await File.findByIdAndUpdate(
      req.params.id,
      {
        fileName: req.body.fileName,
      },
      {
        returnDocument: "after",
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
      message: "Unable to rename file",
    });

  }
};


// =====================
// Delete File / Folder
// =====================

const deleteChildren = async (parentId) => {
  const children = await File.find({ parentId });

  for (const child of children) {
    if (child.type === "folder") {
      await deleteChildren(child._id);
    }

    await File.findByIdAndDelete(child._id);
  }
};

const deleteFile = async (req, res) => {
  try {

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (file.type === "folder") {
      await deleteChildren(file._id);
    }

    await File.findByIdAndDelete(file._id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to delete",
    });

  }
};
module.exports = {
  createFile,
  getFiles,
  getFile,
  updateFile,
  moveFile,
  deleteFile,
  importProject,
};

