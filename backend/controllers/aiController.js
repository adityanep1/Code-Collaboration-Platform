const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

 const completion = await client.chat.completions.create({
  model: "openrouter/free",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

    res.json({
      success: true,
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  askAI,
};