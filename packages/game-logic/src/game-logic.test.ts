import { GameLogic } from "./game-logic";
import { Tile } from "./tile";
import { PlaceResult } from "./types";

const PLAYER_1 = "player-1-id";
const PLAYER_2 = "player-2-id";

describe("GameLogic", () => {
  it("should end the game as expected when player 1 wins", () => {
    const logic = new GameLogic(PLAYER_1, PLAYER_2);
    logic.play(PLAYER_1, Tile.J10);
    logic.play(PLAYER_2, Tile.A1);
    logic.play(PLAYER_1, Tile.J11);
    logic.play(PLAYER_2, Tile.A2);
    logic.play(PLAYER_1, Tile.J12);
    logic.play(PLAYER_2, Tile.A3);
    logic.play(PLAYER_1, Tile.J9);
    logic.play(PLAYER_2, Tile.A4);
    expect(logic.play(PLAYER_1, Tile.J8)).toEqual({
      winner: PLAYER_1,
      result: PlaceResult.Success,
    });
  });

  it("should end the game as expected when player 2 wins", () => {
    const logic = new GameLogic(PLAYER_1, PLAYER_2);
    logic.play(PLAYER_1, Tile.J10);
    logic.play(PLAYER_2, Tile.A1);
    logic.play(PLAYER_1, Tile.J11);
    logic.play(PLAYER_2, Tile.A2);
    logic.play(PLAYER_1, Tile.J12);
    logic.play(PLAYER_2, Tile.A3);
    logic.play(PLAYER_1, Tile.J9);
    logic.play(PLAYER_2, Tile.A4);
    logic.play(PLAYER_1, Tile.S2);
    logic.play(PLAYER_2, Tile.A5);
  });

  it("should end the game in the vertical direction", () => {
    const logic = new GameLogic(PLAYER_1, PLAYER_2);
    logic.play(PLAYER_1, Tile.J10);
    logic.play(PLAYER_2, Tile.A1);
    logic.play(PLAYER_1, Tile.K10);
    logic.play(PLAYER_2, Tile.A2);
    logic.play(PLAYER_1, Tile.L10);
    logic.play(PLAYER_2, Tile.A3);
    logic.play(PLAYER_1, Tile.I10);
    logic.play(PLAYER_2, Tile.A4);
    expect(logic.play(PLAYER_1, Tile.H10)).toEqual({
      winner: PLAYER_1,
      result: PlaceResult.Success,
    });
  });

  it("should end the game in the diagonal up direction", () => {
    const logic = new GameLogic(PLAYER_1, PLAYER_2);
    logic.play(PLAYER_1, Tile.J10);
    logic.play(PLAYER_2, Tile.A1);
    logic.play(PLAYER_1, Tile.I11);
    logic.play(PLAYER_2, Tile.A2);
    logic.play(PLAYER_1, Tile.H12);
    logic.play(PLAYER_2, Tile.A3);
    logic.play(PLAYER_1, Tile.K9);
    logic.play(PLAYER_2, Tile.A4);
    expect(logic.play(PLAYER_1, Tile.L8)).toEqual({
      winner: PLAYER_1,
      result: PlaceResult.Success,
    });
  });

  it("should end the game in the diagonal down direction", () => {
    const logic = new GameLogic(PLAYER_1, PLAYER_2);
    logic.play(PLAYER_1, Tile.J10);
    logic.play(PLAYER_2, Tile.A1);
    logic.play(PLAYER_1, Tile.I9);
    logic.play(PLAYER_2, Tile.A2);
    logic.play(PLAYER_1, Tile.H8);
    logic.play(PLAYER_2, Tile.A3);
    logic.play(PLAYER_1, Tile.K11);
    logic.play(PLAYER_2, Tile.A4);
    expect(logic.play(PLAYER_1, Tile.L12)).toEqual({
      winner: PLAYER_1,
      result: PlaceResult.Success,
    });
  });
});
