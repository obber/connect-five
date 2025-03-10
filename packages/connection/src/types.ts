import type { TileKey } from "./constants";
import type { ConnectedPlayer } from "./player";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;

  matchFound: (payload: MatchFoundPayload) => void;
  initGame: () => void;
  toggleTurn: (payload: ToggleTurnPayload) => void;
  invalidMove: (payload: InvalidMovePayload) => void;
  gameEnd: (payload: GameEndPayload) => void;
}

export interface MatchFoundPayload {
  you: ConnectedPlayer;
  them: ConnectedPlayer;
}

export interface GameEndPayload {
  win: boolean;
  board: PlayerBoardState;
}

export interface ToggleTurnPayload {
  yourTurn: boolean;
  board: PlayerBoardState;
}

export interface InvalidMovePayload {
  type: InvalidMoveType;
}

export enum InvalidMoveType {
  Conflict = "Conflict",
  OutOfTurn = "OutOfTurn",
}

export interface ClientToServerEvents {
  hello: (data: string) => void;

  enqueue: (data: string, ack: (data: string) => void) => void;
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

export interface PlayerBoardStateCell {
  tileKey: TileKey;
  relativePlayer: RelativePlayer | null;
}

export enum RelativePlayer {
  YOU = 0,
  THEM = 1,
}

export type PlayerBoardState = PlayerBoardStateCell[][];
