"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSession = void 0;
var roles_1 = __importDefault(require("../config/roles"));
var logger_1 = require("../utils/logger");
var GameSession = /** @class */ (function () {
    function GameSession() {
        this.players = new Map();
        this.roles = this.initializeRoles();
        this.gamePhase = "lobby";
        this.minPlayers = 4;
        this.maxPlayers = 10;
    }
    GameSession.prototype.initializeRoles = function () {
        var roles = new Map();
        for (var _i = 0, _a = Object.entries(roles_1.default); _i < _a.length; _i++) {
            var _b = _a[_i], roleKey = _b[0], config = _b[1];
            roles.set(roleKey, __assign({ isSelect: false }, config));
        }
        return roles;
    };
    GameSession.prototype.checkAllPlayersReady = function (io) {
        var allPlayers = Array.from(this.players.values());
        var readyPlayers = allPlayers.filter(function (player) { return player.isReady; });
        if (readyPlayers.length === allPlayers.length &&
            allPlayers.length >= this.minPlayers) {
            this.gamePhase = "gameCards";
            logger_1.Logger.info("Все игроки готовы! Переход к выбору ролей");
            var rolesArray = Array.from(this.roles.entries()).map(function (_a) {
                var roleKey = _a[0], roleGameData = _a[1];
                return ({ roleKey: roleKey, roleGameData: roleGameData });
            });
            io.emit("gameCards", rolesArray);
        }
    };
    GameSession.prototype.checkAllRolesSelected = function (io) {
        var _this = this;
        var playersCount = this.players.size;
        var selectedRoles = Array.from(this.roles.values()).filter(function (role) { return role.isSelect; }).length;
        if (playersCount === selectedRoles && selectedRoles >= this.minPlayers) {
            this.gamePhase = "game";
            logger_1.Logger.info("Все роли выбраны! Запуск игры...");
            this.players.forEach(function (playerData, playerSocketId) {
                if (playerData.role !== null) {
                    io.to(playerSocketId).emit("startGame", {
                        roleKey: playerData.role,
                        roleGameData: _this.roles.get(playerData.role),
                    });
                }
            });
        }
    };
    GameSession.prototype.getAllPlayers = function () {
        return Array.from(this.players.entries()).map(function (_a) {
            var playerSocket = _a[0], playerData = _a[1];
            return (__assign({ id: playerSocket }, playerData));
        });
    };
    GameSession.prototype.getAllRoles = function () {
        return Array.from(this.roles.entries()).map(function (_a) {
            var roleKey = _a[0], roleGameData = _a[1];
            return ({
                roleKey: roleKey,
                roleGameData: roleGameData,
            });
        });
    };
    GameSession.prototype.resetAllRoles = function () {
        this.roles.forEach(function (roleData) {
            roleData.isSelect = false;
        });
    };
    GameSession.prototype.resetAllReadys = function () {
        this.players.forEach(function (playerData) {
            playerData.isReady = false;
        });
    };
    return GameSession;
}());
exports.GameSession = GameSession;
