import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";

import { runCodeAPI } from "../services/codeService";
import { saveCodeAPI, getRoomAPI } from "../services/roomService";
import { saveExecutionAPI } from "../services/executionService";

const CodeEditor = () => {
  const { roomCode } = useParams();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Start coding here...");
  const [output, setOutput] = useState("");

  // ==========================
  // Handle Editor Change
  // ==========================
  const handleEditorChange = (value) => {
    const newCode = value || "";

    setCode(newCode);
    setOutput("");

    const user = JSON.parse(localStorage.getItem("user"));

    // Typing Event
    socket.emit("typing", {
      roomCode,
      userName: user.name,
    });

    // Code Sync
    socket.emit("code-change", {
      roomCode,
      code: newCode,
    });
  };

  // ==========================
  // Receive Code
  // ==========================
  useEffect(() => {
    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("receive-code");
    };
  }, []);

  // ==========================
  // Auto Save
  // ==========================
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await saveCodeAPI(roomCode, code);
        console.log("✅ Auto Saved");
      } catch (error) {
        console.log(error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [code, roomCode]);

  // ==========================
  // Load Previous Code
  // ==========================
  useEffect(() => {
    const loadCode = async () => {
      try {
        const result = await getRoomAPI(roomCode);

        if (result.room.code) {
          setCode(result.room.code);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadCode();
  }, [roomCode]);

  // ==========================
  // Run Code
  // ==========================
  const runCode = async () => {
    try {
      setOutput("Running Code...");

      // Execute code
      const result = await runCodeAPI(language, code);

      console.log("Run Result:", result);

      setOutput(result.output);

      const user = JSON.parse(localStorage.getItem("user"));

      console.log("Saving execution...");

      const saved = await saveExecutionAPI({
        roomCode,
        language,
        code,
        output: result.output,
        executedBy: user.name,
      });

      console.log("✅ Execution Saved");
      console.log("Saved Response:", saved);

    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      setOutput("Execution Failed");
    }
  };

  return (
    <div>
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          padding: "10px 20px",
        }}
      >
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        <button
          onClick={runCode}
          style={{
            padding: "8px 20px",
            cursor: "pointer",
          }}
        >
          ▶ Run Code
        </button>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="80vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
      />

      {/* Output */}
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #ccc",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h3>Output</h3>

        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;