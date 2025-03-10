import { isNullOrUndefined } from "@c5/utils";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  type PlayerBoardState,
  type GameEndPayload,
  type ToggleTurnPayload,
  RelativePlayer,
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
  const [turn, setTurn] = useState(false);
  const [winState, setWinState] = useState<WinState>(WinState.Undetermined);
  const initializedRef = useRef(false);
  const socket = useConnectionStore((s) => s.socket);
  const handleTurn = useCallback((payload: ToggleTurnPayload) => {
    setTurn(payload.yourTurn);
    setBoard(payload.board);
  }, []);
  const handleGameEnd = useCallback((payload: GameEndPayload) => {
    setBoard(payload.board);
    setWinState(payload.win ? WinState.Win : WinState.Lose);
  }, []);
  useEffect(() => {
    if (initializedRef.current || isNullOrUndefined(socket)) {
      return;
    }
    socket.on("toggleTurn", handleTurn);
    socket.on("gameEnd", handleGameEnd);
    console.info("emitting initGameAck");
    socket.emit("initGameAck");
    initializedRef.current = true;
  }, [socket, handleTurn, handleGameEnd]);

  const flatBoard = flatten(board);

  return (
    <div className="p-4">
      <div className="w-min border border-r-1 border-b-1 border-neutral-200 grid grid-rows-[repeat(19,48px)] grid-cols-[repeat(19,48px)]">
        {flatBoard.map((cell, cellIndex) => {
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
                "hover:bg-neutral-100"
              )}
              key={`board-cell-index-${cellIndex}`}
              type="button"
            >
              {cell === RelativePlayer.YOU ? "O" : null}
              {cell === RelativePlayer.THEM ? "X" : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
