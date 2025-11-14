"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var node_http_1 = require("node:http");
var node_path_1 = __importDefault(require("node:path"));
var GameSession_1 = require("./models/GameSession");
var SocketHandlers_1 = require("./handlers/SocketHandlers");
var GameServer = /** @class */ (function () {
    function GameServer() {
        this.app = (0, express_1.default)();
        this.httpServer = (0, node_http_1.createServer)(this.app);
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.gameSession = new GameSession_1.GameSession();
        this.socketHandlers = new SocketHandlers_1.SocketHandlers(this.io, this.gameSession);
        this.setupServer();
    }
    GameServer.prototype.setupServer = function () {
        var _this = this;
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static("public"));
        if (process.env.NODE_ENV === "production") {
            this.app.use(express_1.default.static(node_path_1.default.join(__dirname, "../client/build")));
            this.app.get("*", function (req, res) {
                res.sendFile(node_path_1.default.join(__dirname, "../client/build", "index.html"));
            });
        }
        else {
            this.app.get("/", function (req, res) {
                res.json({
                    message: "Игровой сервер запущен",
                    players: _this.gameSession.players.size,
                    phase: _this.gameSession.gamePhase,
                });
            });
        }
        this.app.get("/health", function (req, res) {
            res.json({
                status: "ok",
                players: _this.gameSession.players.size,
                phase: _this.gameSession.gamePhase,
            });
        });
        this.io.on("connection", function (socket) {
            console.log("\u0418\u0433\u0440\u043E\u043A \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u043B\u0441\u044F: ".concat(socket.id));
            _this.socketHandlers.setupAllHandlers(socket);
        });
        process.on("SIGINT", function () {
            console.log("\nВыключение сервера...");
            setTimeout(function () {
                process.exit(0);
            }, 1000);
        });
    };
    GameServer.prototype.start = function () {
        var PORT = process.env.PORT || 3001;
        this.httpServer.listen(PORT, function () {
            console.log("Игровой сервер запущен!");
            console.log("\u041F\u043E\u0440\u0442: ".concat(PORT));
            console.log("\u0420\u0435\u0436\u0438\u043C: ".concat(process.env.NODE_ENV || "development"));
            console.log("Время запуска:", new Date().toLocaleString());
            console.log("────────────────────────────────────");
        });
    };
    return GameServer;
}());
var gameServer = new GameServer();
gameServer.start();
