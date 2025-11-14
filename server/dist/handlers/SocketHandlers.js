"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHandlers = void 0;
var logger_1 = require("../utils/logger");
var SocketHandlers = /** @class */ (function () {
    function SocketHandlers(io, gameSession) {
        this.io = io;
        this.gameSession = gameSession;
    }
    SocketHandlers.prototype.setupAllHandlers = function (socket) {
        this.onPlayerConnect(socket);
        this.onPlayerReady(socket);
        this.onGetLobbyState(socket);
        this.onPlayerDisconnect(socket);
        this.onSelectRole(socket);
        this.onGetGameState(socket);
        socket.on("error", function (error) {
            logger_1.Logger.error("Socket error for ".concat(socket.id), error);
        });
    };
    SocketHandlers.prototype.emitLobbyUpdate = function () {
        this.io.emit("lobbyUpdate", this.gameSession.getAllPlayers());
    };
    SocketHandlers.prototype.emitCardsUpdate = function () {
        this.io.emit("cardsUpdate", this.gameSession.getAllRoles());
    };
    SocketHandlers.prototype.onPlayerConnect = function (socket) {
        var _this = this;
        socket.on("playerConnect", function () {
            try {
                if (_this.gameSession.players.has(socket.id)) {
                    return;
                }
                _this.gameSession.players.set(socket.id, {
                    role: null,
                    isReady: false,
                });
                logger_1.Logger.info("\u0418\u0433\u0440\u043E\u043A \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u043B\u0441\u044F: ".concat(socket.id), {
                    totalPlayers: _this.gameSession.players.size,
                });
                _this.emitLobbyUpdate();
            }
            catch (error) {
                logger_1.Logger.error("Ошибка подключения игрока", error, {
                    socketId: socket.id,
                });
            }
        });
    };
    SocketHandlers.prototype.onPlayerReady = function (socket) {
        var _this = this;
        socket.on("playerReady", function () {
            try {
                var player = _this.gameSession.players.get(socket.id);
                if (!player) {
                    return;
                }
                player.isReady = true;
                logger_1.Logger.info("Игрок готов", {
                    socketId: socket.id,
                    role: player.role,
                });
                _this.emitLobbyUpdate();
                _this.gameSession.checkAllPlayersReady(_this.io);
            }
            catch (error) {
                logger_1.Logger.error("Ошибка готовности игрока", error, {
                    socketId: socket.id,
                });
            }
        });
    };
    SocketHandlers.prototype.onSelectRole = function (socket) {
        var _this = this;
        socket.on("selectRole", function (roleKey) {
            try {
                var player = _this.gameSession.players.get(socket.id);
                if (!player) {
                    return;
                }
                var role = _this.gameSession.roles.get(roleKey);
                if (role) {
                    role.isSelect = true;
                    player.role = roleKey;
                }
                logger_1.Logger.info("\u0418\u0440\u043E\u043A ".concat(socket.id, " \u0432\u044B\u0431\u0440\u0430\u043B \u0440\u043E\u043B\u044C ").concat(roleKey), {
                    socketId: socket.id,
                    role: player.role,
                });
                _this.emitCardsUpdate();
                _this.gameSession.checkAllRolesSelected(_this.io);
            }
            catch (error) {
                logger_1.Logger.error("Ошибка выбора роли", error, {
                    socketId: socket.id,
                });
            }
        });
    };
    SocketHandlers.prototype.onGetLobbyState = function (socket) {
        var _this = this;
        socket.on("getLobbyState", function () { return _this.emitLobbyUpdate(); });
    };
    SocketHandlers.prototype.onGetGameState = function (socket) {
        var _this = this;
        socket.on("getGameState", function (roleKey) {
            try {
                if (_this.gameSession.gamePhase === "game") {
                    if (roleKey !== null) {
                        var player = _this.gameSession.players.get(socket.id);
                        if (!player) {
                            return;
                        }
                        var role = _this.gameSession.roles.get(roleKey);
                        if (role) {
                            logger_1.Logger.info("\u0418\u0433\u0440\u043E\u043A ".concat(socket.id, " \u043F\u0435\u0440\u0435\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u043B\u0441\u044F"));
                            player.role = roleKey;
                        }
                    }
                }
                socket.emit("gameState", _this.gameSession.gamePhase);
            }
            catch (error) {
                logger_1.Logger.error("\u0418\u0433\u0440\u043E\u043A ".concat(socket.id, " \u043D\u0435 \u0441\u043C\u043E\u0433 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0444\u0430\u0437\u0443 \u0438\u0433\u0440\u044B"), error, {
                    socketId: socket.id,
                });
            }
        });
    };
    SocketHandlers.prototype.onPlayerDisconnect = function (socket) {
        var _this = this;
        socket.on("disconnect", function (reason) {
            logger_1.Logger.info("Игрок отключился", { socketId: socket.id, reason: reason });
            var player = _this.gameSession.players.get(socket.id);
            if (player) {
                if (_this.gameSession.gamePhase !== "game") {
                    _this.gameSession.resetAllReadys();
                    _this.gameSession.resetAllRoles();
                    _this.io.emit("backToLobby");
                }
                _this.gameSession.players.delete(socket.id);
                _this.emitLobbyUpdate();
            }
        });
    };
    return SocketHandlers;
}());
exports.SocketHandlers = SocketHandlers;
