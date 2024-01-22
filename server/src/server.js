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
let readyPlayers = [];
let player1;
let player2;

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
      const [p1, p2] = waitingPlayers.splice(0, 2);

      console.log(`Found Two players: ${p1.id} and ${p2.id}`);

      // Notify the players that they have been matched, could also send game id etc.
      p1.emit('matched', { opponentId: p2.id, counterColor: "White" });
      p2.emit('matched', { opponentId: p1.id, counterColor: "Black" });

    }
  });

   // Handle WebRTC signaling
   socket.on('webrtc-signal', ({ signalData, opponentId }) => {
    const opponentSocket = io.sockets.sockets.get(opponentId);

    if (opponentSocket) {
      opponentSocket.emit('webrtc-signal', { signalData, senderId: socket.id });
    }
  });

  // When a player clicks the `ready` button
  socket.on('player ready', (data) => {
    console.log(`Player ready: ${socket.id}`);


    // Makes sure socket id is unique
    if (!readyPlayers.includes(socket))
      readyPlayers.push(socket);

    // Check if there are at least two players in the queue
    if (readyPlayers.length >= 2) {
      // Match the first two players
      [player1, player2] = readyPlayers.splice(0, 2);

      console.log(`Two players are now ready: ${player1.id} and ${player2.id}`);

      // Notify the players that they have been matched, could also send game id etc.
      player1.emit('begin game', { opponentId: player2.id, counterColor: "White", currentPlayerTurn: "White"});
      player2.emit('begin game', { opponentId: player1.id, counterColor: "Black", currentPlayerTurn: "White"});

    }
  });

  // When a player makes a move
  socket.on('move', (data) => {

      player1.emit('updateMove', {circleId: data.circleId, nextPlayer: data.nextPlayer});
      player2.emit('updateMove', {circleId: data.circleId, nextPlayer: data.nextPlayer});

  });

  // When a player moves a counter
  socket.on('move counter', (data) => {

    player1.emit('update move counter', {oldPosition: data.oldPosition, newPosition: data.newPosition, nextPlayer: data.nextPlayer});
    player2.emit('update move counter', {oldPosition: data.oldPosition, newPosition: data.newPosition, nextPlayer: data.nextPlayer});

});

// When a player wants to rematch
socket.on('end game', (data) => {
  readyPlayers = [];
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
