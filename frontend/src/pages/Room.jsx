import { useParams } from "react-router-dom";

const Room = () => {

  const { roomCode } = useParams();

  return (
    <div style={{ padding: "30px" }}>
      <h1>Room Page</h1>

      <h2>Room Code: {roomCode}</h2>
    </div>
  );
};

export default Room;