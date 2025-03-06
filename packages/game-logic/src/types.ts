export enum PlaceResult {
  OutOfTurn = "OutOfTurn",
  Conflict = "Conflict",
  Success = "Success",
}

export type BoardState<T extends symbol> = (null | T)[][];

export enum AxisDirection {
  /** UpLeft to DownRight */
  DiagonalDown = "DiagonalDown",
  /** DownLeft to UpRight */
  DiagonalUp = "DiagonalUp",
  Vertical = "Vertical",
  Horizontal = "Horizontal",
}

export enum Direction {
  UpLeft = "UpLeft",
  Up = "Up",
  UpRight = "UpRight",
  Right = "Right",
  DownRight = "DownRight",
  Down = "Down",
  DownLeft = "DownLeft",
  Left = "Left",
}
