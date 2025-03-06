import type { TileKey } from "@c5/connection";
import { isNullOrUndefined } from "@c5/utils";

const CHAR_CODE_FOR_A = 65;
const ONE_BASED_INDEX_OFFSET = 1;

export function getIndicesForTile(tile: TileKey) {
  const firstChar = tile[0];

  if (isNullOrUndefined(firstChar)) {
    throw new Error("Expected firstChar of tile to be defined");
  }

  return {
    rowIndex: firstChar.charCodeAt(0) - CHAR_CODE_FOR_A,
    columnIndex: Number(tile.slice(1)) - ONE_BASED_INDEX_OFFSET,
  };
}
