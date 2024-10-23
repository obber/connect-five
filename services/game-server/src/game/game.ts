import type { Socket } from "socket.io";

export class Game {
  constructor(
    private player1: Socket,
    private player2: Socket
  ) {}

  initialize(): this {
    this.player1.emit("gameEnd");
    return this;
  }
}
