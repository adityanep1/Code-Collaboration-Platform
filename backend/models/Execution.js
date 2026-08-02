const mongoose = require("mongoose");

const executionSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    output: {
      type: String,
      required: true,
    },

    executedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Execution", executionSchema);