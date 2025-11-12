const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const path = require("node:path");
const GameSession = require("./gameSession.js");

function getPlayersArray() {
  return Array.from(players.entries()).map(([playerSocket, playerData]) => ({
    playerSocket,
    playerData,
  }));
}

function getRolesArray() {
  return Array.from(roles.entries()).map(([roleKey, roleGameData]) => ({
    roleKey,
    roleGameData,
  }));
}

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      message: "Socket.io server is running. Use React dev server on port 3000",
    });
  });
}

io.on("connection", (socket) => {
  socket.on("playerConnect", () => {
    players.set(socket.id, { role: null, isReady: false });

    io.emit("lobbyUpdate", getPlayersArray());
  });

  socket.on("getGameState", () => {
    const gameState = gamePhase;
    socket.emit("gameState", gameState);
  });

  socket.on("playerIsReady", () => {
    const player = players.get(socket.id);
    if (player) {
      player.isReady = true;
    }
    io.emit("lobbyUpdate", getPlayersArray());
    gameSession.checkAllPlayersReady(io);
  });

  socket.on("getLobbyState", () => {
    socket.emit("lobbyUpdate", getPlayersArray());
  });

  socket.on("selectRole", (roleKey) => {
    const player = players.get(socket.id);
    if (player) {
      const role = roles.get(roleKey);
      if (role) {
        role.isSelect = true;
        player.role = roleKey;
      }
    }

    io.emit("cardsUpdate", getRolesArray());
    gameSession.checkAllRolesSelected(io);
  });

  socket.on("visit-therapist", () => {
    const therapistID = gameSession.getPlayerByRole("therapist");

    const objEvent = {
      playerSocket: socket.id,
      textEvent: "Пациент пришел на прием",
      pageEvent: "",
      typeEvent: "message",
      buttonsEvent: [
        { id: 1, textButton: "Принять", actionButton: "therapist-accept" },
        {
          id: 2,
          textButton: "Поставить в очередь",
          actionButton: "therapist-reject",
        },
      ],
    };

    io.to(therapistID).emit("new-patient", objEvent);
  });

  socket.on("disconnect", () => {
    const player = players.get(socket.id);

    if (player) {
      if (gamePhase !== "game") {
        if (player.role) {
          const role = roles.get(player.role);
          if (role) {
            role.isSelect = false;
          }
        }

        gameSession.resetAllRoles();
        io.emit("backToLobby");
      }

      players.delete(socket.id);
      io.emit("cardsUpdate", getRolesArray());
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log("Сервер запущен: ", `http://localhost:${PORT}`);
});
