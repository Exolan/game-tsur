import { Socket } from "socket.io-client";

export interface Buttons {
  id: number;
  action: string;
  label: string;
  isActive: boolean;
}

export interface RoleGameData {
  isSelect: boolean;
  displayName: string;
  number: string;
  password: string;
  profile: string;
  task: string;
  description: string;
  image: string;
  buttons: Buttons[];
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
  playerSocket: string;
  playerData: UserGameData;
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

export interface EventButton {
  id: number;
  textButton: string;
  actionButton: string;
}

export interface ObjectEvent {
  playerSocket: string;
  textEvent: string;
  pageEvent: string;
  buttonsEvent: EventButton[];
}

export interface RoleCardProps {
  roleKey: string;
  roleGameData: RoleGameData;
  roleSelect: string | null;
  setRoleSelect: React.Dispatch<React.SetStateAction<string | null>>;
  socket: Socket;
}
