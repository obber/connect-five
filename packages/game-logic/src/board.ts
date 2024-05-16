import { get, getx, isNullOrUndefined } from "@c5/utils";
import {
  AxisDirection,
  Direction,
  PlaceResult,
  type BoardState,
  type Player,
} from "./types";
import type { TileKey } from "./tile";
import { getIndicesForTile } from "./tile-utils";

const OUT_OF_RANGE = "OUT OF RANGE";

export class Board {
  private state: BoardState = createEmptyBoardState();

  get(): BoardState {
    return this.state.map((rows) => rows.map((column) => column));
  }

  place(player: Player, tile: TileKey): PlaceResult {
    if (this.isTaken(tile)) {
      return PlaceResult.Conflict;
    }

    const { rowIndex, columnIndex } = getIndicesForTile(tile);
    const row = getx(this.state, rowIndex);
    row[columnIndex] = player;

    return PlaceResult.Success;
  }

  checkWinner(lastTile: TileKey): boolean {
    return this.getMaxStreakForTile(lastTile) >= 5;
  }

  private isTaken(tile: TileKey) {
    return this.getTileValue(tile) !== null;
  }

  private getTileValue(tile: TileKey): Player | null | typeof OUT_OF_RANGE {
    const { rowIndex, columnIndex } = getIndicesForTile(tile);
    return this.getTileValueAtIndices(rowIndex, columnIndex);
  }

  private getTileValueAtIndices(
    rowIndex: number,
    columnIndex: number
  ): Player | null | typeof OUT_OF_RANGE {
    const row = get(this.state, rowIndex);
    if (isNullOrUndefined(row)) {
      return OUT_OF_RANGE;
    }
    const column = get(row, columnIndex);
    if (column === undefined) {
      return OUT_OF_RANGE;
    }
    return column;
  }

  private getMaxStreakForTile(tile: TileKey) {
    return Math.max(
      this.getStreakFromTileInAxisDirection(tile, AxisDirection.DiagonalDown),
      this.getStreakFromTileInAxisDirection(tile, AxisDirection.DiagonalUp),
      this.getStreakFromTileInAxisDirection(tile, AxisDirection.Horizontal),
      this.getStreakFromTileInAxisDirection(tile, AxisDirection.Vertical)
    );
  }

  private getStreakFromTileInAxisDirection(
    tile: TileKey,
    direction: AxisDirection
  ): number {
    switch (direction) {
      case AxisDirection.DiagonalDown:
        return (
          this.getStreakFromTileInDirection(tile, Direction.UpLeft) +
          this.getStreakFromTileInDirection(tile, Direction.DownRight)
        );
      case AxisDirection.DiagonalUp:
        return (
          this.getStreakFromTileInDirection(tile, Direction.DownLeft) +
          this.getStreakFromTileInDirection(tile, Direction.UpRight)
        );
      case AxisDirection.Horizontal:
        return (
          this.getStreakFromTileInDirection(tile, Direction.Left) +
          this.getStreakFromTileInDirection(tile, Direction.Right)
        );
      case AxisDirection.Vertical:
        return (
          this.getStreakFromTileInDirection(tile, Direction.Up) +
          this.getStreakFromTileInDirection(tile, Direction.Down)
        );
    }
  }

  private getStreakFromTileInDirection(
    tile: TileKey,
    direction: Direction
  ): number {
    const { rowIndex: startRowIndex, columnIndex: startColumnIndex } =
      getIndicesForTile(tile);
    const value = this.getTileValue(tile);
    let currentRowIndex = startRowIndex;
    let currentColumnIndex = startColumnIndex;
    let currentValue = value;
    let streak = 1;
    while (currentValue === value) {
      const [nextRowIndex, nextColumnIndex] = this.getNextIndices(
        currentRowIndex,
        currentColumnIndex,
        direction
      );
      const nextTileValue = this.getTileValueAtIndices(
        nextRowIndex,
        nextColumnIndex
      );
      if (nextTileValue !== value) {
        break;
      }
      streak++;
      currentValue = nextTileValue;
      currentRowIndex = nextRowIndex;
      currentColumnIndex = nextColumnIndex;
    }
    return streak;
  }

  private getNextIndices(
    rowIndex: number,
    columnIndex: number,
    direction: Direction
  ): [number, number] {
    switch (direction) {
      case Direction.Left:
        return [rowIndex, columnIndex - 1];
      case Direction.Right:
        return [rowIndex, columnIndex + 1];
      case Direction.Up:
        return [rowIndex - 1, columnIndex];
      case Direction.Down:
        return [rowIndex + 1, columnIndex];
      case Direction.UpLeft:
        return [rowIndex - 1, columnIndex - 1];
      case Direction.UpRight:
        return [rowIndex - 1, columnIndex + 1];
      case Direction.DownLeft:
        return [rowIndex + 1, columnIndex - 1];
      case Direction.DownRight:
        return [rowIndex + 1, columnIndex + 1];
    }
  }
}

function createEmptyBoardState(): null[][] {
  const boardState = [];
  for (let i = 0; i < 19; i++) {
    const row = new Array(19).fill(null) as null[];
    boardState.push(row);
  }
  return boardState;
}
