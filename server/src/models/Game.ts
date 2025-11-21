import { GameState, Player, Role } from "../types/types";
import rolesConfig from "../config/roles";
import { Server } from "socket.io";
import { Logger } from "../utils/logger";

export class Game {
  public players: Player[];
  public roles: Map<string, Role>;
  public gameState: GameState;
  public minPlayers: number;
  public maxPlayers: number;

  constructor() {
    this.players = [];
    this.roles = new Map();
    this.gameState = "lobby";
    this.minPlayers = 4;
    this.maxPlayers = 10;
  }

  private initializeRoles(countPlayers: number): Map<string, Role> {
    const roles = new Map();
    for (const [roleKey, config] of Object.entries(rolesConfig)) {
      roles.set(roleKey, { playerId: null, ...config });
    }
    Logger.info("Роли созданы! Смена фазы");
    return roles;
  }

  public checkAllPlayersReady(io: Server): void {
    const allPlayers = Array.from(this.players.values());
    const readyPlayers = allPlayers.filter((player) => player.isReady);

    if (
      readyPlayers.length === allPlayers.length &&
      allPlayers.length >= this.minPlayers
    ) {
      this.gameState = "cards";
      Logger.info("Все игроки готовы! Инициализация ролей...");

      this.initializeRoles(allPlayers.length);

      const rolesArray = Array.from(this.roles.entries()).map(
        ([roleKey, roleGameData]) => ({ roleKey, roleGameData })
      );

      io.emit("gameCards", rolesArray);
    }
  }

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

  public createPlayer(playerSocket: string): void {
    this.players.push({
      playerId: this.players.length,
      isReady: false,
      playerSocket,
      playerRole: null,
    });
  }

  public getAllPlayers(): Player[] {
    return this.players;
  }

  public getAllRoles(): Array<{ roleKey: string } & { roleGameData: Role }> {
    return Array.from(this.roles.entries()).map(([roleKey, roleGameData]) => ({
      roleKey: roleKey,
      roleGameData: roleGameData,
    }));
  }

  public getPlayerBySocket(playerSocket: string): Player | null {
    for (const player of this.players) {
      if (player.playerSocket === playerSocket) {
        return player;
      }
    }

    return null;
  }

  public resetAllRoles(): void {
    this.players.forEach((player) => {
      player.playerRole = null;
    });
  }

  public resetAllReadys(): void {
    this.players.forEach((player) => {
      player.isReady = false;
    });
  }
}
