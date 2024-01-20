// socketServer.js
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your Vite dev server URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = 3001; // Choose a suitable port

let waitingPlayers = [];

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // When a player enters matchmaking
  socket.on('enter matchmaking', () => {
    console.log(`Entered matchmaking: ${socket.id}`);

    waitingPlayers.push(socket);

    // Check if there are at least two players in the queue
    if (waitingPlayers.length >= 2) {
      // Match the first two players
      const [player1, player2] = waitingPlayers.splice(0, 2);

      // Notify the players that they have been matched, could also send game id etc.
      player1.emit('matched', { opponentId: player2.id });
      player2.emit('matched', { opponentId: player1.id });

      // Here you could create a game session and handle game logic
    }
  });

  socket.on('disconnect', () => {
    // Remove the player from the queue if they disconnect
    waitingPlayers = waitingPlayers.filter(player => player.id !== socket.id);
    console.log(`Client disconnected: ${socket.id}`);

  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
