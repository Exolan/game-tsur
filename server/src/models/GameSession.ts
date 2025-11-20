import {
  GameEvent,
  GamePhase,
  Player,
  Role,
  EventType,
  EventData,
} from "../types";
import rolesConfig from "../config/roles";
import { Server } from "socket.io";
import { Logger } from "../utils/logger";

export class GameSession {
  public players: Map<string, Player>;
  public roles: Map<string, Role>;
  public gamePhase: GamePhase;
  public minPlayers: number;
  public maxPlayers: number;
  public events: Map<string, GameEvent>;

  constructor() {
    this.players = new Map();
    this.roles = this.initializeRoles();
    this.gamePhase = "lobby";
    this.minPlayers = 4;
    this.maxPlayers = 10;
    this.events = new Map();
  }

  public activateEvent(
    eventKey: string,
    playerId: string
  ): ({ eventKey: string } & { eventData: GameEvent }) | null {
    const eventData = this.events.get(eventKey);

    if (!eventData) {
      return null;
    }
    eventData.from = playerId;

    return { eventKey, eventData: eventData };
  }

  public createEvent(
    eventKey: string,
    type: EventType,
    from: string | null,
    to: string | null,
    data: EventData[]
  ): GameEvent {
    const event: GameEvent = {
      type,
      from,
      to,
      data,
      step: 0,
    };

    this.events.set(eventKey, event);

    Logger.info("Создан новый ивент", {
      type: event.type,
      from: event.from,
      to: event.to,
    });

    return event;
  }

  public initializeGameEvents(roles: Map<string, Role>): void {
    const therapistId = roles.get("therapist")?.playerId;

    if (therapistId) {
      this.events.set("visit-therapist", {
        type: "message",
        from: null,
        to: therapistId,
        data: [
          {
            text: "К вам пришел пациент",
            buttons: [
              { id: 1, text: "Принять его", action: "patient-therapist" },
              {
                id: 2,
                text: "Поставить в очередь",
                action: "patient-to-queue",
              },
            ],
          },
        ],
        step: 0,
      });
    }
  }

  private initializeRoles(): Map<string, Role> {
    const roles = new Map();
    for (const [roleKey, config] of Object.entries(rolesConfig)) {
      roles.set(roleKey, { playerId: null, ...config });
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
      (role) => role.playerId
    ).length;

    if (playersCount === selectedRoles && selectedRoles >= this.minPlayers) {
      this.gamePhase = "game";

      Logger.info("Все роли выбраны! Запуск игры...");

      this.initializeGameEvents(this.roles);

      for (const [roleKey, roleGameData] of Array.from(this.roles.entries())) {
        if (roleGameData.playerId !== null) {
          io.to(roleGameData.playerId).emit("startGame", {
            roleKey,
            roleGameData,
          });
        }
      }
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
      roleData.playerId = null;
    });
  }

  public resetAllSelects(): void {
    this.players.forEach((playerData) => {
      playerData.isSelect = false;
    });
  }

  public resetAllReadys(): void {
    this.players.forEach((playerData) => {
      playerData.isReady = false;
    });
  }
}
