export interface Player {
  isReady: boolean;
  isSelect: boolean;
}

export interface Role {
  playerId: string | null;
  displayName: string;
  number: string;
  password: string;
  profile: string;
  task: string;
  description: string;
  image: string;
  buttons: Button[];
  listenEvents: string[];
  activeEvents: Map<string, GameEvent[]> | null;
  maxInstances?: number;
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

export type GamePhase = "lobby" | "gameCards" | "game";

export type EventType = "call" | "message";
