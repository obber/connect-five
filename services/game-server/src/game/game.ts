import type { Socket } from "socket.io";
import type {
  ClientToServerEvents,
  PlayerTurnPayload,
  ServerToClientEvents,
} from "@c5/connection";
import { GameLogic, PlaceResult } from "@c5/game-logic";
import { isNotNullOrUndefined } from "@c5/utils";

const PLAYER_1 = Symbol("player-1");
const PLAYER_2 = Symbol("player-2");
type PlayerIdentifier = typeof PLAYER_1 | typeof PLAYER_2;
interface PlayerState {
  ready: boolean;
  turn: boolean;
  socket: Socket<ClientToServerEvents, ServerToClientEvents>;
}

export class Game {
  private state: Record<PlayerIdentifier, PlayerState>;
  private gameLogic: GameLogic<PlayerIdentifier>;
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

  initialize(): this {
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
    this.get(playerId).ready = true;
    this.maybeInitializeTurns();
  }

  private handlePlayerTurn(
    playerId: PlayerIdentifier,
    { tileKey }: PlayerTurnPayload
  ) {
    const { result, winner } = this.gameLogic.play(playerId, tileKey);

    // TODO: Add an enum to c5/connection for denoting YOU vs THEM on the board
    // state. Then, map the playerId symbols to a 2-d array of
    // RelativePlayer.YOU vs RelativePlayer.THEM.
    //
    // That will make sure that each client only needs to account for YOU or
    // THEM, regardless of which player they are (player 1 or player 2).

    if (result === PlaceResult.OutOfTurn) {
      // Invalid move
      return;
    }

    if (result === PlaceResult.Conflict) {
      // Invalid move
      return;
    }

    if (isNotNullOrUndefined(winner)) {
      // End game
      return;
    }

    this.doTurn(this.getOpponentPlayerId(playerId));
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
    const { player, oppont } = this.getBoth(nextTurnPlayerId);
    player.turn = true;
    oppont.turn = false;
    player.socket.emit("toggleTurn", {
      yourTurn: true,
      // TODO: Map this to board state.
      board: [],
    });
    oppont.socket.emit("toggleTurn", {
      yourTurn: false,
      // TODO: Map this to board state.
      board: [],
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
}
