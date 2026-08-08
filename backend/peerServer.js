const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: 9000,
  path: "/peerjs",
});

console.log("🚀 PeerJS Server running on port 9000");