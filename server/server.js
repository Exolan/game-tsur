const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const GameSession = require("./gameSession.js");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let gameSession = new GameSession();
let { players, roles, gamePhase } = gameSession.getData();

// Только для production будем раздавать статику
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
} else {
  // Для разработки просто тестовый endpoint
  app.get("/", (req, res) => {
    res.json({
      message: "Socket.io server is running. Use React dev server on port 3000",
    });
  });
}

io.on("connection", (socket) => {
  const socketID = socket.id;

  socket.on("playerConnect", () => {
    console.log("ID пользователя: ", socketID);
    players.set(socketID, { role: null, isReady: false });
    console.log(players);
    io.emit("lobbyUpdate", Array.from(players.entries()));
  });

  socket.on("playerIsReady", () => {
    const player = players.get(socketID);
    if (player) {
      player.isReady = true;
    }
    io.emit("lobbyUpdate", Array.from(players.entries()));
    gameSession.checkAllPlayersReady(io);
  });

  socket.on("selectRole", (roleKey) => {
    const player = players.get(socketID);
    if (player) {
      const role = roles.get(roleKey);
      if (role) {
        role.isSelect = true;
        player.role = roleKey;
      }
    }
    console.log(`Пользователь ${socketID} выбрал роль ${roleKey}`);
    io.emit("cardsUpdate", Array.from(roles.entries()));
    gameSession.checkAllRolesSelected(io);
  });

  socket.on("visit-therapist", () => {
    const socketID = socket.id;
    const therapistID = gameSession.getPlayerByRole("therapist");

    console.log(therapistID);

    const obj = {
      playerID: socketID,
      text: "Пациент пришел на прием",
      buttons: [
        { text: "Принять", action: "therapist-accept" },
        { text: "Поставить в очередь", action: "therapist-reject" },
      ],
    };

    console.log("Событие для терапевта");
    io.to(therapistID).emit("new-patient", obj);
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился");
    const player = players.get(socketID);

    if (gamePhase != "game") {
      if (player && player.role) {
        const role = roles.get(player.role);
        if (role) {
          role.isSelect = false;
        }
      }
      players.delete(socketID);
      io.emit("backToLobby", Array.from(players.entries()));
    }

    io.emit("lobbyUpdate", Array.from(players.entries()));
    io.emit("cardsUpdate", Array.from(roles.entries()));
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log("Сервер запущен: ", `http://localhost:${PORT}`);
});
