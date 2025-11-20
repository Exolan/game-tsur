import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import path from "node:path";
import { GameSession } from "./models/GameSession";
import { SocketHandlers } from "./handlers/SocketHandlers";

class GameServer {
  private readonly app: express.Application;
  private readonly io: Server;
  private readonly httpServer: any;
  private readonly gameSession: GameSession;
  private readonly socketHandlers: SocketHandlers;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.gameSession = new GameSession();
    this.socketHandlers = new SocketHandlers(this.io, this.gameSession);

    this.setupServer();
  }

  private setupServer(): void {
    this.app.use(express.json());
    this.app.use(express.static("public"));

    if (process.env.NODE_ENV === "production") {
      this.app.use(express.static(path.join(__dirname, "../client/build")));
      this.app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/build", "index.html"));
      });
    } else {
      this.app.get("/", (req, res) => {
        res.json({
          message: "Игровой сервер запущен",
          players: this.gameSession.players.size,
          phase: this.gameSession.gamePhase,
        });
      });
    }

    this.app.get("/health", (req, res) => {
      res.json({
        status: "ok",
        players: this.gameSession.players.size,
        phase: this.gameSession.gamePhase,
      });
    });

    this.io.on("connection", (socket) => {
      console.log(`Игрок подключился: ${socket.id}`);
      this.socketHandlers.setupAllHandlers(socket);
    });

    process.on("SIGINT", () => {
      console.log("\nВыключение сервера...");
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    });
  }

  public start(): void {
    const PORT = process.env.PORT || 3001;

    this.httpServer.listen(PORT, () => {
      console.log("Игровой сервер запущен!");
      console.log(`Порт: ${PORT}`);
      console.log(`Режим: ${process.env.NODE_ENV || "development"}`);
      console.log("Время запуска:", new Date().toLocaleString());
      console.log("────────────────────────────────────");
    });
  }
}

const gameServer = new GameServer();
gameServer.start();
