const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["file", "folder"],
      default: "file",
    },

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

    path: {
      type: String,
      default: "",
    },

    extension: {
      type: String,
      default: "",
    },

    size: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("File", fileSchema);