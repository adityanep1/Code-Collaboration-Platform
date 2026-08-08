require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes");

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Use AI Routes
app.use("/api/ai", aiRoutes);

// Create HTTP Server
const server = http.createServer(app);

// Create Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Load Socket Logic
require("./sockets/socket")(io);

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});