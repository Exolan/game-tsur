import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://192.168.1.14:3001", {
  autoConnect: false,
});
