import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CodeEditor from "../components/Editor";
import Chat from "../components/Chat";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import socket from "../socket/socket";
import ExecutionHistory from "../components/ExecutionHistory";
import FileExplorer from "../components/FileExplorer";

const Room = () => {
  const { roomCode } = useParams();

  const [selectedFileId, setSelectedFileId] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    socket.emit("join-room", {
      roomCode,
      userName: user.name,
    });

    socket.on("room-users", (usersList) => {
      setUsers(usersList);
    });

  socket.on("user-typing", (userName) => {

  console.log("📥 Typing Received:", userName);

  setTypingUser(`${userName} is typing...`);

  setTimeout(() => {
    setTypingUser("");
  }, 1000);

});

    return () => {
      socket.off("room-users");
      socket.off("user-typing");
    };
  }, [roomCode]);

  return (
   <div className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <Navbar
        roomCode={roomCode}
        onlineCount={users.length}
      />

      {/* Typing Indicator */}
 <div
  style={{
    background: "red",
    color: "white",
    padding: "15px",
    fontSize: "20px",
    textAlign: "center",
  }}
>
  {typingUser}
</div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 h-[calc(100vh-80px)]">

       {/* Sidebar */}
<div className="col-span-2 flex flex-col gap-4">

  <Sidebar users={users} />

<FileExplorer
  selectedFileId={selectedFileId}
  setSelectedFileId={setSelectedFileId}
  openTabs={openTabs}
  setOpenTabs={setOpenTabs}
/>

</div>

        {/* Main Content */}
       <div className="col-span-10 bg-gray-100 p-5 overflow-auto">

          <div className="grid grid-cols-12 gap-5 h-full">

            {/* Editor */}
            <div className="col-span-8 flex flex-col">

              <div className="bg-white rounded-xl shadow-lg p-4 h-full">

 <CodeEditor
  selectedFileId={selectedFileId}
  openTabs={openTabs}
  setOpenTabs={setOpenTabs}
  setSelectedFileId={setSelectedFileId}
/>
                <ExecutionHistory />

              </div>

            </div>

            {/* Chat */}
            <div className="col-span-4">

              <div className="bg-white rounded-xl shadow-lg p-4 h-full">

                <Chat />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Room;