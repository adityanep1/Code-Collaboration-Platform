require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Create HTTP Server
const server = http.createServer(app);

// Create Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Socket Connection
io.on("connection", (socket) => {

  console.log("🟢 User Connected:", socket.id);

  socket.on("join-room", (roomCode) => {

    socket.join(roomCode);

    console.log(`${socket.id} joined room ${roomCode}`);

  });

  socket.on("code-change", ({ roomCode, code }) => {

    socket.to(roomCode).emit("receive-code", code);

  });

  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);
  });

});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});