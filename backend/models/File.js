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