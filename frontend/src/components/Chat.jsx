import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";

const Chat = () => {
  const { roomCode } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  // ==========================
  // Send Message
  // ==========================
  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("send-message", {
      roomCode,
      message,
      userName: user.name,
    });

    setMessage("");
  };

  // ==========================
  // Receive Messages
  // ==========================
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  return (
    <div className="h-[650px] flex flex-col">

      {/* Heading */}
      <h2 className="text-2xl font-bold mb-4">
        💬 Chat
      </h2>

      {/* Messages */}
      <div
        className="
          h-[500px]
          overflow-y-auto
          border
          rounded-lg
          p-4
          bg-gray-50
          space-y-3
        "
      >
        {messages.length === 0 ? (
          <p className="text-gray-500">
            No messages yet...
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-3"
            >
              <div className="flex justify-between">
                <span className="font-bold text-blue-600">
                  {msg.userName}
                </span>

                <span className="text-xs text-gray-500">
                  {msg.time}
                </span>
              </div>

              <p className="mt-2 text-gray-700">
                {msg.message}
              </p>
            </div>
          ))
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4 flex-shrink-0">

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          className="
            flex-1
            border
            rounded-lg
            px-4
            py-2
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        <button
          onClick={sendMessage}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            rounded-lg
            transition
          "
        >
          Send
        </button>

      </div>

    </div>
  );
};

export default Chat;