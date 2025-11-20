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
exports.Game = void 0;
var roles_1 = __importDefault(require("../config/roles"));
var logger_1 = require("../utils/logger");
var Game = /** @class */ (function () {
    function Game() {
        this.players = [];
        this.roles = new Map();
        this.gameState = "lobby";
        this.minPlayers = 4;
        this.maxPlayers = 10;
    }
    Game.prototype.initializeRoles = function (countPlayers) {
        var roles = new Map();
        for (var _i = 0, _a = Object.entries(roles_1.default); _i < _a.length; _i++) {
            var _b = _a[_i], roleKey = _b[0], config = _b[1];
            roles.set(roleKey, __assign({ playerId: null }, config));
        }
        logger_1.Logger.info("Роли созданы! Смена фазы");
        return roles;
    };
    Game.prototype.checkAllPlayersReady = function (io) {
        var allPlayers = Array.from(this.players.values());
        var readyPlayers = allPlayers.filter(function (player) { return player.isReady; });
        if (readyPlayers.length === allPlayers.length &&
            allPlayers.length >= this.minPlayers) {
            this.gameState = "cards";
            logger_1.Logger.info("Все игроки готовы! Инициализация ролей...");
            this.initializeRoles(allPlayers.length);
            var rolesArray = Array.from(this.roles.entries()).map(function (_a) {
                var roleKey = _a[0], roleGameData = _a[1];
                return ({ roleKey: roleKey, roleGameData: roleGameData });
            });
            io.emit("gameCards", rolesArray);
        }
    };
    // public checkAllRolesSelected(io: Server): void {
    //   const playersCount = this.players.size;
    //   const selectedRoles = Array.from(this.roles.values()).filter(
    //     (role) => role
    //   ).length;
    //   if (playersCount === selectedRoles && selectedRoles >= this.minPlayers) {
    //     this.gameState = "game";
    //     Logger.info("Все роли выбраны! Запуск игры...");
    //     for (const [roleKey, roleGameData] of Array.from(this.roles.entries())) {
    //       if (roleGameData.playerId !== null) {
    //         io.to(roleGameData.playerId).emit("startGame", {
    //           roleKey,
    //           roleGameData,
    //         });
    //       }
    //     }
    //   }
    // }
    Game.prototype.getAllPlayers = function () {
        return this.players;
    };
    Game.prototype.getAllRoles = function () {
        return Array.from(this.roles.entries()).map(function (_a) {
            var roleKey = _a[0], roleGameData = _a[1];
            return ({
                roleKey: roleKey,
                roleGameData: roleGameData,
            });
        });
    };
    Game.prototype.resetAllRoles = function () {
        this.players.forEach(function (player) {
            player.playerRole = null;
        });
    };
    Game.prototype.resetAllReadys = function () {
        this.players.forEach(function (player) {
            player.isReady = false;
        });
    };
    return Game;
}());
exports.Game = Game;
