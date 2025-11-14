export interface Player {
  role: string | null;
  isReady: boolean;
}

export interface Role {
  isSelect: boolean;
  displayName: string;
  number: string;
  password: string;
  profile: string;
  task: string;
  description: string;
  image: string;
  buttons: Button[];
  maxInstances?: number;
}

export interface Button {
  id: number;
  action: string;
  label: string;
  isActive: boolean;
}

export interface GameEvent {
  id: number;
  type: EventType;
  from: string | null;
  to: string | null;
  data: EventData[];
  step: number;
}

export interface EventData {
  id: number;
  text: string;
}

export type GamePhase = "lobby" | "gameCards" | "game";

export type EventType = "call" | "message";
