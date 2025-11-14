import { GamePhase, Player, Role } from "../types";
import rolesConfig from "../config/roles";
import { Server } from "socket.io";
import { Logger } from "../utils/logger";

export class GameSession {
  public players: Map<string, Player>;
  public roles: Map<string, Role>;
  public gamePhase: GamePhase;
  public minPlayers: number;
  public maxPlayers: number;

  constructor() {
    this.players = new Map();
    this.roles = this.initializeRoles();
    this.gamePhase = "lobby";
    this.minPlayers = 4;
    this.maxPlayers = 10;
  }

  private initializeRoles(): Map<string, Role> {
    const roles = new Map();
    for (const [roleKey, config] of Object.entries(rolesConfig)) {
      roles.set(roleKey, { isSelect: false, ...config });
    }
    return roles;
  }

  public checkAllPlayersReady(io: Server): void {
    const allPlayers = Array.from(this.players.values());
    const readyPlayers = allPlayers.filter((player) => player.isReady);

    if (
      readyPlayers.length === allPlayers.length &&
      allPlayers.length >= this.minPlayers
    ) {
      this.gamePhase = "gameCards";
      Logger.info("Все игроки готовы! Переход к выбору ролей");

      const rolesArray = Array.from(this.roles.entries()).map(
        ([roleKey, roleGameData]) => ({ roleKey, roleGameData })
      );

      io.emit("gameCards", rolesArray);
    }
  }

  public checkAllRolesSelected(io: Server): void {
    const playersCount = this.players.size;
    const selectedRoles = Array.from(this.roles.values()).filter(
      (role) => role.isSelect
    ).length;

    if (playersCount === selectedRoles && selectedRoles >= this.minPlayers) {
      this.gamePhase = "game";

      Logger.info("Все роли выбраны! Запуск игры...");

      this.players.forEach((playerData, playerSocketId) => {
        if (playerData.role !== null) {
          io.to(playerSocketId).emit("startGame", {
            roleKey: playerData.role,
            roleGameData: this.roles.get(playerData.role),
          });
        }
      });
    }
  }

  public getAllPlayers(): Array<{ id: string } & Player> {
    return Array.from(this.players.entries()).map(
      ([playerSocket, playerData]) => ({
        id: playerSocket,
        ...playerData,
      })
    );
  }

  public getAllRoles(): Array<{ roleKey: string } & { roleGameData: Role }> {
    return Array.from(this.roles.entries()).map(([roleKey, roleGameData]) => ({
      roleKey: roleKey,
      roleGameData: roleGameData,
    }));
  }

  public resetAllRoles(): void {
    this.roles.forEach((roleData) => {
      roleData.isSelect = false;
    });
  }

  public resetAllReadys(): void {
    this.players.forEach((playerData) => {
      playerData.isReady = false;
    });
  }
}
