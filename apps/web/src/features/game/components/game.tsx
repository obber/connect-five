import { isNotNullOrUndefined, isNullOrUndefined } from "@c5/utils";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { RelativePlayer } from "@c5/connection";
import type {
  TileKey,
  PlayerBoardState,
  GameEndPayload,
  ToggleTurnPayload,
} from "@c5/connection";
import { flatten } from "lodash";
import { useConnectionStore } from "@/features/connection/store";

enum WinState {
  Win,
  Lose,
  Undetermined,
}

export interface GameProps {}

export const Game: FC<GameProps> = ({}) => {
  const [board, setBoard] = useState<PlayerBoardState>([]);
  const [yourTurn, setYourTurn] = useState(false);
  const [winState, setWinState] = useState<WinState>(WinState.Undetermined);
  const initializedRef = useRef(false);
  const socket = useConnectionStore((s) => s.socket);
  const handleClick = useCallback(
    (tileKey: TileKey) => {
      console.info("emitting playerTurn");
      socket?.emit("playerTurn", { tileKey });
    },
    [socket]
  );
  const handleTurn = useCallback((payload: ToggleTurnPayload) => {
    setYourTurn(payload.yourTurn);
    setBoard(payload.board);
  }, []);
  const handleGameEnd = useCallback((payload: GameEndPayload) => {
    console.log("handleGameEnd payload = ", payload);
    setBoard(payload.board);
    setWinState(payload.win ? WinState.Win : WinState.Lose);
  }, []);
  useEffect(() => {
    if (initializedRef.current || isNullOrUndefined(socket)) {
      return;
    }
    socket.on("toggleTurn", handleTurn);
    socket.on("gameEnd", handleGameEnd);
    socket.emit("initGameAck");
    initializedRef.current = true;
  }, [socket, handleTurn, handleGameEnd]);

  const flatBoard = flatten(board);

  return (
    <div className="p-4">
      <div className="w-min border border-r-1 border-b-1 border-neutral-200 grid grid-rows-[repeat(19,48px)] grid-cols-[repeat(19,48px)]">
        {flatBoard.map((cell, cellIndex) => {
          if (isNotNullOrUndefined(cell.relativePlayer)) {
            console.log("cell = ", cell);
          }
          return (
            <button
              className={classNames(
                "border",
                "border-t-1",
                "border-l-1",
                "border-b-0",
                "border-r-0",
                "border-neutral-200",
                "cursor-pointer",
                "hover:bg-neutral-100",
                { "pointer-events-none": !yourTurn }
              )}
              disabled={!yourTurn}
              key={`board-cell-index-${cellIndex}`}
              onClick={() => {
                handleClick(cell.tileKey);
              }}
              type="button"
            >
              {cell.relativePlayer === RelativePlayer.YOU ? "O" : null}
              {cell.relativePlayer === RelativePlayer.THEM ? "X" : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
