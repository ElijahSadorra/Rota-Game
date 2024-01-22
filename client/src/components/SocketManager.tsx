import { io } from "socket.io-client";

// An export file that uses the local host
const socket = io("http://localhost:3001");

export default socket;
