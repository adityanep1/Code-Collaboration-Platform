const Execution = require("../models/Execution");

// ===============================
// Save Execution
// ===============================
const saveExecution = async (req, res) => {
  try {
    const execution = await Execution.create(req.body);

    res.status(201).json({
      success: true,
      execution,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to save execution",
    });
  }
};

// ===============================
// Get Room History
// ===============================
const getHistory = async (req, res) => {
  try {
    const history = await Execution.find({
      roomCode: req.params.roomCode,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      history,
    });
  } catch (error) {
  console.error("===== EXECUTION ERROR =====");
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
};

module.exports = {
  saveExecution,
  getHistory,
};