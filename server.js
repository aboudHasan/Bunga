import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { createRoom, checkRoom } from "./utils/rooms.js";
import {
  generateCards,
  shuffleCards,
  createHand,
  regenerateCards,
  drawCard,
} from "./utils/cards.js";
import { addPlayer, removePlayer, getPlayers } from "./utils/players.js";

const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const roomTurns = {};
const roomPlayerSockets = {};

io.on("connection", (socket) => {
  socket.on("create room", (roomCode) => {
    const room = createRoom(roomCode.code);

    console.log("Room details: ", room);

    generateCards();
    shuffleCards();
  });

  socket.on("room check", (code) => {
    const roomCode = Number(code);
    const roomCheck = checkRoom(roomCode);

    if (roomCheck.message) {
      socket.emit("msg", roomCheck.message);
    } else {
      socket.emit("successful room check");
    }
  });

  socket.on("new player", (user) => {
    socket.join(user.code);

    const currentRoom = checkRoom(Number(user.code));
    currentRoom.players += 1;
    addPlayer(user);

    const playerList = getPlayers(Number(user.code));
    io.to(user.code).emit("player list", playerList);

    if (!roomPlayerSockets[user.code]) roomPlayerSockets[user.code] = [];
    roomPlayerSockets[user.code].push(socket.id);

    io.to(user.code).emit("msg", currentRoom.players);
    io.to(user.code).emit("msg", user.username);

    if (currentRoom.players == 1) {
      io.to(user.code).emit("you are host");
    }

    socket.on("draw card", () => {
      const playerSockets = roomPlayerSockets[user.code];
      const currentIndex = roomTurns[user.code];
      const currentSocketId = playerSockets[currentIndex];

      if (socket.id !== currentSocketId) return;

      let newCard = drawCard();
      socket.emit("receive card", newCard);

      roomTurns[user.code] = (currentIndex + 1) % playerSockets.length;
      const nextSocketId = playerSockets[roomTurns[user.code]];
      io.to(user.code).emit("set turn", nextSocketId);
    });

    socket.on("start game", async () => {
      const sockets = await io.in(user.code).fetchSockets();
      for (const playerSocket of sockets) {
        playerSocket.emit("receive hand", createHand());
      }

      const playerSockets = sockets.map((s) => s.id);
      roomPlayerSockets[user.code] = playerSockets;
      roomTurns[user.code] = 0;
      io.to(user.code).emit("set turn", playerSockets[0]);
    });

    socket.on("disconnect", () => {
      console.log("player left");
      currentRoom.players -= 1;
    });
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

server.listen(port, () => console.log(`Server is running on port ${port}`));
