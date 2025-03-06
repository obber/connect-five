import type { TileKey } from "@c5/connection";
import { Board } from "./board";
import type { BoardState } from "./types";
import { PlaceResult } from "./types";

export type PlayedState<T extends symbol> =
  | ErrorPlayedState
  | SuccessPlayedState<T>;

interface ErrorPlayedState {
  winner: null;
  result: PlaceResult.Conflict | PlaceResult.OutOfTurn;
}

interface SuccessPlayedState<T extends symbol> {
  result: PlaceResult.Success;
  winner: T | null;
  board: BoardState<T>;
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
        board: this.board.get(),
        result: PlaceResult.Success,
      };
    }

    return {
      winner: null,
      board: this.board.get(),
      result: PlaceResult.Success,
    };
  }

  private toggleTurn() {
    this.turn = this.turn === this.player1Id ? this.player2Id : this.player1Id;
  }
}
