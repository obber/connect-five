export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;

  initGame: () => void;
  toggleTurn: (turnPlayerId: string) => void;
  gameEnd: (winnerId: string) => void;
}

export interface ClientToServerEvents {
  hello: (data: string) => void;
  playerReady: () => void;
  playerTurn: (tileId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
