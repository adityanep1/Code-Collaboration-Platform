import { useState } from "react";
import axios from "axios";

const AIAssistant = ({ code, language }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const askAI = async (instruction) => {
    const currentCode = code || "";

    if (!currentCode.trim() && !prompt.trim()) {
      setResponse("Please enter some code or a question.");
      return;
    }

    try {
      setLoading(true);
      setResponse("");

      const finalPrompt = instruction
        ? `${instruction}

Programming Language: ${language}

Code:
\`\`\`
${currentCode}
\`\`\`
`
        : prompt;

      const res = await axios.post(
        "http://localhost:5000/api/ai",
        {
          prompt: finalPrompt,
        }
      );

      setResponse(res.data.reply || "No response received.");

    } catch (error) {
      console.log(error);

      setResponse(
        error.response?.data?.message ||
        "Failed to communicate with AI."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mt-4">

      <h2 className="text-xl font-bold mb-3">
        🤖 AI Assistant
      </h2>

      {/* AI Actions */}

      <div className="grid grid-cols-2 gap-2 mb-4">

        <button
          onClick={() =>
            askAI(
              "Explain this code clearly. Explain what it does, how it works, and mention important concepts."
            )
          }
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
        >
          📖 Explain
        </button>

        <button
          onClick={() =>
            askAI(
              "Analyze this code for bugs or errors. Explain each problem and provide corrected code."
            )
          }
          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
        >
          🐞 Fix Bug
        </button>

        <button
          onClick={() =>
            askAI(
              "Optimize this code. Improve readability, performance, and maintainability. Explain your changes."
            )
          }
          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
        >
          ⚡ Optimize
        </button>

        <button
          onClick={() =>
            askAI(
              "Generate useful test cases for this code and explain what each test checks."
            )
          }
          className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
        >
          🧪 Tests
        </button>

      </div>

      {/* Custom Prompt */}

      <textarea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask AI anything about your code..."
        className="w-full border rounded-lg p-3 mb-3"
      />

      <button
        onClick={() => askAI()}
        disabled={loading}
        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50"
      >
        {loading ? "🤔 Thinking..." : "🤖 Ask AI"}
      </button>

      {/* Response */}

      {response && (
        <div className="mt-4 bg-gray-100 rounded-lg p-4">

          <h3 className="font-bold mb-2">
            AI Response
          </h3>

          <pre className="whitespace-pre-wrap text-sm overflow-auto">
            {response}
          </pre>

        </div>
      )}

      {response && (
  <button
  onClick={async () => {
    try {
      await navigator.clipboard.writeText(response);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.log("Clipboard failed:", error);

      // Fallback for browsers that block clipboard API
      const textarea = document.createElement("textarea");

      textarea.value = response;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      document.execCommand("copy");

      document.body.removeChild(textarea);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }}
  className="mt-3 bg-gray-700 text-white px-4 py-2 rounded-lg"
>
  {copied ? "✅ Copied!" : "📋 Copy Response"}
</button>
)}

    </div>
  );
};

export default AIAssistant;