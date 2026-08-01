import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";

const CodeEditor = () => {

  const { roomCode } = useParams();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Start coding here...");

  const handleEditorChange = (value) => {

    const newCode = value || "";

    setCode(newCode);

    socket.emit("code-change", {
      roomCode,
      code: newCode,
    });

  };

  useEffect(() => {

    socket.on("receive-code", (newCode) => {

      setCode(newCode);

    });

    return () => {

      socket.off("receive-code");

    };

  }, []);

  return (
    <div>

      <div style={{ padding: "10px" }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <Editor
        height="80vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
      />

    </div>
  );
};

export default CodeEditor;