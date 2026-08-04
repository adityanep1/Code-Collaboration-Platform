const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
    },

    // File or Folder Name
    fileName: {
      type: String,
      required: true,
    },

    // File or Folder
    type: {
      type: String,
      enum: ["file", "folder"],
      default: "file",
    },

    // Parent Folder
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },

    language: {
      type: String,
      default: "javascript",
    },

    code: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("File", fileSchema);