export interface Player {
  playerId: number;
  isReady: boolean;
  playerSocket: string;
  playerRole: { [roleKey: string]: Role } | null;
}

export interface Role {
  displayName: string;
  number: string;
  password: string;
  profile: string;
  task: string;
  description: string;
  condition?: string;
  image: string;
  buttons: Button[];
}

export interface Button {
  id: number;
  action: string;
  label: string;
  isActive: boolean;
}

export interface GameEvent {
  type: EventType;
  from: string | null;
  to: string | null;
  data: EventData[];
  step: number;
}

export interface EventButton {
  id: number;
  text: string;
  action: string;
}

export interface EventData {
  text: string;
  buttons: EventButton[];
}

export type GameState = "lobby" | "cards" | "game";

export type EventType = "call" | "message";
