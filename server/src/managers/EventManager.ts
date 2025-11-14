import { Logger } from "../utils/logger";
import { Server } from "socket.io";

export class EventManager {
  private events: GameEvent[] = [];
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }
}
