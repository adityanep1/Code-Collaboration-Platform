const onlineUsers = {};

module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("🟢 User Connected:", socket.id);

    // ===========================
    // JOIN ROOM
    // ===========================
    socket.on("join-room", ({ roomCode, userName }) => {

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