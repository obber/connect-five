import type { TileKey } from "@c5/connection";
import { Board } from "./board";
import type { BoardState } from "./types";
import { PlaceResult } from "./types";

interface PlayedState<T extends symbol> {
  winner: T | null;
  result: PlaceResult.Conflict | PlaceResult.OutOfTurn | PlaceResult.Success;
}

export class GameLogic<T extends symbol> {
  private turn: T;
  private board = new Board<T>();

  constructor(
    private player1Id: T,
    private player2Id: T
  ) {
    this.turn = player1Id;
  }

  play(playerId: T, tile: TileKey): PlayedState<T> {
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

  getBoard(): BoardState<T> {
    return this.board.get();
  }

  private toggleTurn() {
    this.turn = this.turn === this.player1Id ? this.player2Id : this.player1Id;
  }
}
