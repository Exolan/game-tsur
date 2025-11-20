import { Socket } from "socket.io-client";

export interface Buttons {
  id: number;
  action: string;
  label: string;
  isActive: boolean;
}

export interface RoleGameData {
  playerId: string | null;
  displayName: string;
  number: string;
  password: string;
  profile: string;
  task: string;
  description: string;
  image: string;
  buttons: Buttons[];
  events: string[];
  maxInstances?: number;
}

export interface Role {
  roleKey: string;
  roleGameData: RoleGameData;
}

export interface UserGameData {
  role: string | null;
  isReady: boolean;
}

export interface Player {
  id: string;
  isSelect: boolean;
  isReady: boolean;
}

export interface GameProps {
  socket: Socket;
}

export interface GameCardsProps extends GameProps {
  roles: Role[];
}

export interface GameBoardProps extends GameProps {
  userRoleData: Role | null;
}

export interface EventData {
  text: string;
  buttons: EventButton[];
}

export interface EventButton {
  id: number;
  text: string;
  action: string;
}

export interface GameEvent {
  type: EventType;
  from: string | null;
  to: string | null;
  data: EventData[];
  step: number;
}

export interface RoleCardProps {
  roleKey: string;
  roleGameData: RoleGameData;
  roleSelect: string | null;
  setRoleSelect: React.Dispatch<React.SetStateAction<string | null>>;
  socket: Socket;
}

export type EventType = "call" | "message";
