import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/Editor";
import socket from "../socket/socket";

const Room = () => {

  const { roomCode } = useParams();

  useEffect(() => {

    socket.emit("join-room", roomCode);

    console.log("Joined Room:", roomCode);

  }, [roomCode]);

  return (
    <div>
      <h2 style={{ padding: "20px" }}>
        Room Code: {roomCode}
      </h2>

      <CodeEditor />
    </div>
  );
};

export default Room;