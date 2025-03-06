import type { TileKey } from "./constants";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;

  initGame: () => void;
  toggleTurn: (payload: ToggleTurnPayload) => void;
  gameEnd: (winnerId: string) => void;
}

export interface ToggleTurnPayload {
  yourTurn: boolean;
  board: RelativePlayer[][];
}

export interface ClientToServerEvents {
  hello: (data: string) => void;
  initGameAck: () => void;
  playerTurn: (payload: PlayerTurnPayload) => void;
}

export interface PlayerTurnPayload {
  tileKey: TileKey;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export enum RelativePlayer {
  YOU = 0,
  THEM = 1,
}
