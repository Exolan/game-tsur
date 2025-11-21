import { Game } from "src/models/Game";
import { Logger } from "../utils/logger";
import { Server, Socket } from "socket.io";

export class SocketHandlers {
  private readonly io: Server;
  private readonly game: Game;

  constructor(io: Server, game: Game) {
    this.io = io;
    this.game = game;
  }

  public setupAllHandlers(socket: Socket): void {
    this.onPlayerConnect(socket);
    this.onPlayerReady(socket);
    this.onGetLobbyState(socket);
    this.onPlayerDisconnect(socket);
    this.onSelectRole(socket);
    this.onGetGameState(socket);
    this.onActivateEvent(socket);

    socket.on("error", (error: any) => {
      Logger.error(`Socket error for ${socket.id}`, error);
    });
  }

  private emitLobbyUpdate(): void {
    this.io.emit("lobbyUpdate", this.game.getAllPlayers());
  }

  private emitCardsUpdate(): void {
    this.io.emit("cardsUpdate", this.game.getAllRoles());
  }

  private onPlayerConnect(socket: Socket): void {
    socket.on("playerConnect", () => {
      try {
        if (this.game.getPlayerBySocket(socket.id)) {
          return;
        }

        this.game.createPlayer(socket.id);

        Logger.info(`Игрок подключился: ${socket.id}`, {
          totalPlayers: this.game.players.length,
        });

        this.emitLobbyUpdate();
      } catch (error) {
        Logger.error("Ошибка подключения игрока", error, {
          socketId: socket.id,
        });
      }
    });
  }

  private onPlayerReady(socket: Socket): void {
    socket.on("playerReady", () => {
      try {
        const player = this.game.getPlayerBySocket(socket.id);
        if (!player) {
          return;
        }

        player.isReady = true;

        Logger.info("Игрок готов", {
          socketId: socket.id,
        });

        this.emitLobbyUpdate();
        this.game.checkAllPlayersReady(this.io);
      } catch (error) {
        Logger.error("Ошибка готовности игрока", error, {
          socketId: socket.id,
        });
      }
    });
  }

  private onSelectRole(socket: Socket): void {
    socket.on("selectRole", (roleKey: string) => {
      try {
        const player = this.game.getPlayerBySocket(socket.id);
        if (!player) {
          return;
        }

        const role = player.playerRole;
        if (role) {
          role.playerId = socket.id;
          player.isSelect = true;
        }

        Logger.info(`Ирок ${socket.id} выбрал роль ${roleKey}`, {
          socketId: socket.id,
          role: roleKey,
        });

        this.emitCardsUpdate();
        this.game.checkAllRolesSelected(this.io);
      } catch (error) {
        Logger.error("Ошибка выбора роли", error, {
          socketId: socket.id,
        });
      }
    });
  }

  private onGetLobbyState(socket: Socket): void {
    socket.on("getLobbyState", () => this.emitLobbyUpdate());
  }

  private onGetGameState(socket: Socket): void {
    socket.on("getGameState", (roleKey: string) => {
      try {
        if (this.game.gamePhase === "game") {
          if (roleKey !== null) {
            const player = this.game.players.get(socket.id);

            if (!player) {
              return;
            }

            const role = this.game.roles.get(roleKey);

            if (role) {
              Logger.info(`Игрок ${socket.id} переподключился`);
              player.isReady = true;
              player.isSelect = true;
              role.playerId = socket.id;
            }
          }
        }

        socket.emit("gameState", this.game.gamePhase);
      } catch (error) {
        Logger.error(`Игрок ${socket.id} не смог получить фазу игры`, error, {
          socketId: socket.id,
        });
      }
    });
  }

  private onActivateEvent(socket: Socket): void {
    socket.on("activateEvent", (eventKey: string) => {
      try {
        if (!eventKey) {
          return;
        }

        const roles = this.game.roles;
        if (!roles) {
          return;
        }

        const event = this.game.activateEvent(eventKey, socket.id);
        if (!event) {
          return;
        }

        if (!event.eventData.to) {
          return;
        }

        Logger.info(
          `Игрок ${socket.id} активировал событие ${event.eventKey}`,
          {
            eventKey: event.eventKey,
            eventData: event.eventData,
          }
        );

        this.io.to(event.eventData.to).emit(event.eventKey, event.eventData);
      } catch (error) {
        Logger.error(`Ошибка в активации ивента`, error, {
          socketId: socket.id,
        });
      }
    });
  }

  private onPlayerDisconnect(socket: Socket): void {
    socket.on("disconnect", (reason: string) => {
      Logger.info("Игрок отключился", { socketId: socket.id, reason });

      const player = this.game.players.get(socket.id);
      if (player) {
        if (this.game.gamePhase !== "game") {
          this.game.resetAllReadys();
          this.game.resetAllRoles();
          this.game.resetAllSelects();
          this.io.emit("backToLobby");
        }
        this.game.players.delete(socket.id);
        this.emitLobbyUpdate();
      }
    });
  }
}
