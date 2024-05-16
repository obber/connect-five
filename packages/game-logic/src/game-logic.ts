import { Board } from "./board";
import { Player, PlaceResult } from "./types";
import type { TileKey } from "./tile";

export class GameLogic {
  private turn = Player.Player1;
  private playerIds = new Map<Player, string>();
  private board = new Board();

  constructor(player1Id: string, player2Id: string) {
    this.playerIds.set(Player.Player1, player1Id);
    this.playerIds.set(Player.Player2, player2Id);
  }

  play(
    playerId: string,
    tile: TileKey
  ): { winner: string | null; result: PlaceResult } {
    if (this.playerIds.get(this.turn) !== playerId) {
      // Invalid player, do nothing.
      return { winner: null, result: PlaceResult.OutOfTurn };
    }

    const result = this.board.place(this.turn, tile);
    if (result === PlaceResult.Conflict) {
      return { winner: null, result };
    }

    if (this.board.checkWinner(tile)) {
      return {
        winner: playerId,
        result: PlaceResult.Success,
      };
    }

    this.toggleTurn();
    return {
      winner: null,
      result: PlaceResult.Success,
    };
  }

  private toggleTurn() {
    this.turn === Player.Player1 ? Player.Player2 : Player.Player1;
  }
}
