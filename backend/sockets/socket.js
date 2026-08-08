const onlineUsers = {};

module.exports = (io) => {

  io.on("connection", (socket) => {

    socket.on("whiteboard-draw", (data) => {
  socket.to(data.roomCode).emit(
    "whiteboard-draw",
    data
  );
});

socket.on("whiteboard-clear", (data) => {
  socket.to(data.roomCode).emit(
    "whiteboard-clear"
  );
});

    console.log("🟢 User Connected:", socket.id);

    // ===========================
    // JOIN ROOM
    // ===========================
    socket.on("join-room", ({ roomCode, userName }) => {
      socket.on("peer-id", ({ roomCode, peerId }) => {
  socket.to(roomCode).emit("peer-user", {
    peerId,
  });
});
      console.log("========== JOIN ROOM ==========");
      console.log("Room Code:", roomCode);
      console.log("User Name:", userName);

      socket.join(roomCode);

      // Create room if it doesn't exist
      if (!onlineUsers[roomCode]) {
        onlineUsers[roomCode] = [];
      }

      // Check if user already exists
      const exists = onlineUsers[roomCode].find(
        (user) => user.socketId === socket.id
      );

      if (!exists) {
        onlineUsers[roomCode].push({
          socketId: socket.id,
          name: userName,
        });
      }

      console.log("Current Online Users:");
      console.log(onlineUsers);

      io.to(roomCode).emit("room-users", onlineUsers[roomCode]);

    });

    // ===========================
    // CODE CHANGE
    // ===========================
    socket.on("code-change", ({ roomCode, code }) => {

      socket.to(roomCode).emit("receive-code", code);

    });

    // ===========================
// File Created
// ===========================
socket.on("file-created", ({ roomCode }) => {
  socket.to(roomCode).emit("refresh-files");
});

    // ===========================
// Typing Indicator
// ===========================
socket.on("typing", ({ roomCode, userName }) => {

  console.log("BACKEND RECEIVED", roomCode, userName);

  socket.to(roomCode).emit("user-typing", userName);

});

    // ==========================
// Live Cursor Tracking
// ==========================
socket.on("cursor-change", (data) => {
  socket.to(data.roomCode).emit("receive-cursor", data);
});

// ===========================
// CHAT MESSAGE
// ===========================
socket.on("send-message", ({ roomCode, message, userName }) => {

  io.to(roomCode).emit("receive-message", {
    userName,
    message,
    time: new Date().toLocaleTimeString(),
  });

});

// ===========================
// EXECUTION SAVED
// ===========================
socket.on("execution-saved", ({ roomCode }) => {

  io.to(roomCode).emit("refresh-history");

});

// ===========================
// VIDEO CALL SIGNALING
// ===========================

socket.on("video-offer", ({ roomCode, signal }) => {
  socket.to(roomCode).emit("video-offer", {
    signal,
    callerId: socket.id,
  });
});

socket.on("video-answer", ({ roomCode, signal }) => {
  socket.to(roomCode).emit("video-answer", {
    signal,
  });
});

socket.on("ice-candidate", ({ roomCode, candidate }) => {
  socket.to(roomCode).emit("ice-candidate", {
    candidate,
  });
});

// ===========================
// WHITEBOARD DRAW
// ===========================
socket.on("draw", (data) => {
  socket.to(data.roomCode).emit("draw", data);
});

// ===========================
// CLEAR WHITEBOARD
// ===========================
socket.on("clear-board", ({ roomCode }) => {
  socket.to(roomCode).emit("clear-board");
});

    // ===========================
    // DISCONNECT
    // ===========================
    socket.on("disconnect", () => {

      console.log("🔴 User Disconnected:", socket.id);

      for (const roomCode in onlineUsers) {

        onlineUsers[roomCode] = onlineUsers[roomCode].filter(
          (user) => user.socketId !== socket.id
        );

        console.log(`Updated Users in Room ${roomCode}:`);
        console.log(onlineUsers[roomCode]);

        io.to(roomCode).emit("room-users", onlineUsers[roomCode]);

      }

    });

  });

};