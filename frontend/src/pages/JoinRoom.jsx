import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import api from "../services/api";

const JoinRoom = () => {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");

  const handleJoin = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/rooms/join",
        {
          roomCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Joined Room Successfully!");

      navigate(`/room/${roomCode}`);

    } catch (error) {
      console.log(error.response?.data);

      alert(error.response?.data?.message || "Unable to join room");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Join Room</h1>

      <br />

      <Input
        name="roomCode"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />

      <br />

      <button onClick={handleJoin}>
        Join Room
      </button>

    </div>
  );
};

export default JoinRoom;