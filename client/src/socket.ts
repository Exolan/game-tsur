import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://192.168.1.14:3001";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});
