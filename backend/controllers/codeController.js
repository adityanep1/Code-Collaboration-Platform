const axios = require("axios");

const runCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    return res.json({
      success: true,
      language,
      code,
      output: "This is where execution result will come."
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  runCode,
};