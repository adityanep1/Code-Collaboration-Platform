import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";

const Whiteboard = () => {
  const { roomCode } = useParams();

  // Make the room unique to your collaboration room
  const syncRoomId = useMemo(
    () => `code-collab-${roomCode}`,
    [roomCode]
  );

  const store = useSyncDemo({
    roomId: syncRoomId,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        marginTop: "20px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #ddd",
      }}
    >
      <Tldraw store={store} />
    </div>
  );
};

export default Whiteboard;