const axios = require("axios");

const languageMap = {
  javascript: {
    language: "nodejs",
    versionIndex: "4",
  },
  python: {
    language: "python3",
    versionIndex: "0",
  },
  java: {
    language: "java",
    versionIndex: "4",
  },
  cpp: {
    language: "cpp17",
    versionIndex: "1",
  },
};

const runCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    const config = languageMap[language];

    if (!config) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language",
      });
    }

    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      {
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: code,
        stdin: "",
        language: config.language,
        versionIndex: config.versionIndex,
        compileOnly: false,
      }
    );

    return res.json({
      success: true,
      output: response.data.output,
      memory: response.data.memory,
      cpuTime: response.data.cpuTime,
    });

  } catch (err) {

    console.error(err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: "Execution Failed",
    });

  }
};

module.exports = {
  runCode,
};