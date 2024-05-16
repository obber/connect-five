import { Board } from "./board";
import { Player } from "./types";
import type { TileKey } from "./tile";

export class GameLogic {
  private turn: string;
  private board = new Board();

  constructor(
    private player1Id: string,
    private player2Id: string
  ) {
    this.turn = player1Id;
  }

  play(
    playerId: string,
    tile: TileKey
  ): { winner: string | null; placed: boolean } {
    if (playerId !== this.turn) {
      // Invalid player, do nothing.
      return { winner: null, placed: false };
    }

    const placed = this.board.place(
      playerId === this.player1Id ? Player.Player1 : Player.Player2,
      tile
    );
    if (!placed) {
      throw new Error("Unexpected player");
    }
    if (this.board.checkWinner(tile)) {
      return {
        winner: this.turn,
        placed: true,
      };
    }

    this.turn = this.turn === this.player1Id ? this.player2Id : this.player1Id;
    return {
      winner: null,
      placed: true,
    };
  }
}
