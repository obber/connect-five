import type { TileKey } from "@c5/connection";
import { Board } from "./board";
import { PlaceResult } from "./types";

export class GameLogic<T extends symbol> {
  private turn: T;
  private board = new Board();

  constructor(
    private player1Id: T,
    private player2Id: T
  ) {
    this.turn = player1Id;
  }

  play(playerId: T, tile: TileKey): { winner: T | null; result: PlaceResult } {
    if (playerId !== this.turn) {
      return {
        winner: null,
        result: PlaceResult.OutOfTurn,
      };
    }
    const result = this.board.place(playerId, tile);
    this.toggleTurn();

    if (result === PlaceResult.Conflict) {
      return { winner: null, result };
    }

    if (this.board.checkWinner(tile)) {
      return {
        winner: playerId,
        result: PlaceResult.Success,
      };
    }

    return {
      winner: null,
      result: PlaceResult.Success,
    };
  }

  private toggleTurn() {
    this.turn = this.turn === this.player1Id ? this.player2Id : this.player1Id;
  }
}
