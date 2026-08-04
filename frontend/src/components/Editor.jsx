import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
import {
  updateFileAPI,
  getFileAPI,
} from "../services/fileService";

import { runCodeAPI } from "../services/codeService";
import { saveCodeAPI, getRoomAPI } from "../services/roomService";
import { saveExecutionAPI } from "../services/executionService";

const CodeEditor = ({
  selectedFileId,
  openTabs,
  setOpenTabs,
  setSelectedFileId,
}) => {
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

      if (selectedFileId) {

  await updateFileAPI(selectedFileId, {
    code,
    language,
  });

} else {

  await saveCodeAPI(roomCode, code);

}

      console.log("✅ Auto Saved");

    } catch (error) {
      console.log(error);
    }
  }, 2000);

  return () => clearTimeout(timer);

}, [code, roomCode, selectedFileId, language]);

// ==========================
// Load Room Code (only once)
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

  // Only load room code when NO file is selected
  if (!selectedFileId) {
    loadCode();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [roomCode]);

// ==========================
// Load Selected File
// ==========================
useEffect(() => {

  const loadSelectedFile = async () => {

    if (!selectedFileId) return;

    try {

      const result = await getFileAPI(selectedFileId);

      console.log("Loaded File:", result.file);

      setCode(result.file.code || "");
      setLanguage(result.file.language || "javascript");

    } catch (error) {

      console.log(error);

    }

  };

  loadSelectedFile();

}, [selectedFileId]);
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






  return(
  <div>

    {/* ==========================
        VS Code Tabs
    ========================== */}

    <div
      style={{
        display: "flex",
        alignItems: "center",
        overflowX: "auto",
        background: "#1e1e1e",
        color: "white",
        borderBottom: "1px solid #444",
      }}
    >
      {openTabs.map((tab) => (

  <div
    key={tab._id}
    onClick={() => setSelectedFileId(tab._id)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 15px",
      cursor: "pointer",
      background:
        selectedFileId === tab._id
          ? "#2d2d2d"
          : "#1e1e1e",
      borderRight: "1px solid #444",
    }}
  >
    <span>📄 {tab.fileName}</span>

    <span
      onClick={(e) => {
        e.stopPropagation();

        const updatedTabs = openTabs.filter(
          (item) => item._id !== tab._id
        );

        setOpenTabs(updatedTabs);

        if (selectedFileId === tab._id) {
          if (updatedTabs.length > 0) {
            setSelectedFileId(updatedTabs[0]._id);
          } else {
            setSelectedFileId(null);
          }
        }
      }}
      style={{
        color: "#ff6b6b",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      ✕
    </span>
  </div>

))}
    </div>

    {/* Top Bar */}


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

  </div>

);
};

export default CodeEditor;