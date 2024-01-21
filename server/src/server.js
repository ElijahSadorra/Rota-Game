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
let readyPlayers = []

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // When a player enters matchmaking
  socket.on('enter matchmaking', () => {
    console.log(`Entered matchmaking: ${socket.id}`);

    // Makes sure socket id is unique
    if (!waitingPlayers.includes(socket))
      waitingPlayers.push(socket);

    // Check if there are at least two players in the queue
    if (waitingPlayers.length >= 2) {
      // Match the first two players
      const [player1, player2] = waitingPlayers.splice(0, 2);

      console.log(`Found Two players: ${player1.id} and ${player2.id}`);

      // Notify the players that they have been matched, could also send game id etc.
      player1.emit('matched', { opponentId: player2.id, counterColor: "White" });
      player2.emit('matched', { opponentId: player1.id, counterColor: "Black" });

    }
  });

  // When a player clicks the `ready` button
  socket.on('player ready', (data) => {
    console.log(`Player ready: ${socket.id}`);

    console.log(data);

    // Makes sure socket id is unique
    if (!readyPlayers.includes(socket))
    readyPlayers.push(socket);

    // Check if there are at least two players in the queue
    if (readyPlayers.length >= 2) {
      // Match the first two players
      const [player1, player2] = readyPlayers.splice(0, 2);

      console.log(`Two players are now ready: ${player1.id} and ${player2.id}`);

      // Notify the players that they have been matched, could also send game id etc.
      player1.emit('begin game', { opponentId: player2.id, counterColor: "White" });
      player2.emit('begin game', { opponentId: player1.id, counterColor: "Black" });

    }
  });

  socket.on('disconnect', () => {
      // Remove the player from the queue if they disconnect
      waitingPlayers = waitingPlayers.filter(player => player.id !== socket.id);
      console.log(`Client disconnected: ${socket.id}`);
      console.log(waitingPlayers);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
