import type { Socket } from "socket.io";
import { InvalidMoveType, RelativePlayer } from "@c5/connection";
import type {
  ClientToServerEvents,
  PlayerBoardState,
  PlayerTurnPayload,
  ServerToClientEvents,
} from "@c5/connection";
import { GameLogic, PlaceResult } from "@c5/game-logic";
import { isNotNullOrUndefined } from "@c5/utils";
import { Logger } from "@nestjs/common";

const logger = new Logger("Game");

const PLAYER_1 = Symbol("player-1");
const PLAYER_2 = Symbol("player-2");
type PlayerIdentifier = typeof PLAYER_1 | typeof PLAYER_2;
interface PlayerState {
  ready: boolean;
  turn: boolean;
  socket: Socket<ClientToServerEvents, ServerToClientEvents>;
}

interface OnEndInternalPayload {
  winnerSocket: Socket<ClientToServerEvents, ServerToClientEvents>;
}

export class Game {
  private state: Record<PlayerIdentifier, PlayerState>;
  private gameLogic: GameLogic<PlayerIdentifier>;
  private onEndCallback?: (params: OnEndInternalPayload) => void;

  constructor(
    player1: Socket<ClientToServerEvents, ServerToClientEvents>,
    player2: Socket<ClientToServerEvents, ServerToClientEvents>
  ) {
    this.state = {
      [PLAYER_1]: {
        ready: false,
        turn: false,
        socket: player1,
      },
      [PLAYER_2]: {
        ready: false,
        turn: false,
        socket: player2,
      },
    };
    this.gameLogic = new GameLogic<PlayerIdentifier>(PLAYER_1, PLAYER_2);
  }

  initialize({
    onEndCallback,
  }: {
    onEndCallback: (params: OnEndInternalPayload) => void;
  }): this {
    this.onEndCallback = onEndCallback;
    this.socket(PLAYER_1).emit("initGame");
    this.socket(PLAYER_2).emit("initGame");
    this.socket(PLAYER_1).on("initGameAck", () => {
      this.handleInitGameAck(PLAYER_1);
    });
    this.socket(PLAYER_2).on("initGameAck", () => {
      this.handleInitGameAck(PLAYER_2);
    });
    return this;
  }

  private handleInitGameAck(playerId: PlayerIdentifier) {
    logger.log(`handleInitGame ${String(playerId)}`);
    this.get(playerId).ready = true;
    this.maybeInitializeTurns();
  }

  private handlePlayerTurn(
    playerId: PlayerIdentifier,
    { tileKey }: PlayerTurnPayload
  ) {
    const { result, winner: winnerId } = this.gameLogic.play(playerId, tileKey);

    if (result === PlaceResult.OutOfTurn) {
      this.socket(playerId).emit("invalidMove", {
        type: InvalidMoveType.OutOfTurn,
      });
      return;
    }

    if (result === PlaceResult.Conflict) {
      this.socket(playerId).emit("invalidMove", {
        type: InvalidMoveType.Conflict,
      });
      return;
    }

    if (isNotNullOrUndefined(winnerId)) {
      this.endGame({ winnerId });
      this.onEndCallback?.({ winnerSocket: this.socket(winnerId) });
      return;
    }

    this.doTurn(this.getOpponentPlayerId(playerId));
  }

  private endGame({ winnerId }: { winnerId: PlayerIdentifier }) {
    const loserId = this.getOpponentPlayerId(winnerId);
    const { player: winner, oppont: loser } = this.getBoth(winnerId);
    winner.socket.emit("gameEnd", {
      win: true,
      board: this.getPlayerBoardState(winnerId),
    });
    loser.socket.emit("gameEnd", {
      win: false,
      board: this.getPlayerBoardState(loserId),
    });
  }

  private maybeInitializeTurns() {
    if (!this.get(PLAYER_1).ready || !this.get(PLAYER_2).ready) {
      return;
    }
    this.socket(PLAYER_1).on("playerTurn", (payload) => {
      this.handlePlayerTurn(PLAYER_1, payload);
    });
    this.socket(PLAYER_2).on("playerTurn", (payload) => {
      this.handlePlayerTurn(PLAYER_2, payload);
    });
    this.doTurn(PLAYER_1);
  }

  private doTurn(nextTurnPlayerId: PlayerIdentifier) {
    logger.log(`doTurn, next = ${String(nextTurnPlayerId)}`);
    const { player, oppont } = this.getBoth(nextTurnPlayerId);
    player.turn = true;
    oppont.turn = false;
    player.socket.emit("toggleTurn", {
      yourTurn: true,
      board: this.getPlayerBoardState(nextTurnPlayerId),
    });
    oppont.socket.emit("toggleTurn", {
      yourTurn: false,
      board: this.getPlayerBoardState(
        this.getOpponentPlayerId(nextTurnPlayerId)
      ),
    });
  }

  private getBoth(playerId: PlayerIdentifier) {
    return {
      player: this.get(playerId),
      // This is spelled this way so that it is the same length as "player" for
      // nicer formatting.
      oppont: this.getOpponent(playerId),
    };
  }

  private get(player: PlayerIdentifier) {
    return this.state[player];
  }

  private getOpponent(player: PlayerIdentifier) {
    return this.get(this.getOpponentPlayerId(player));
  }

  private getOpponentPlayerId(player: PlayerIdentifier) {
    if (player === PLAYER_1) {
      return PLAYER_2;
    }
    return PLAYER_1;
  }

  private socket(player: PlayerIdentifier) {
    return this.state[player].socket;
  }

  private getPlayerBoardState(playerId: PlayerIdentifier): PlayerBoardState {
    const opponentId = this.getOpponentPlayerId(playerId);
    return this.gameLogic.getBoard().map((row) => {
      return row.map((cell) => {
        if (cell === playerId) {
          return RelativePlayer.YOU;
        }
        if (cell === opponentId) {
          return RelativePlayer.THEM;
        }
        return null;
      });
    });
  }
}
