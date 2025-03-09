import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "@c5/connection";
import { Logger } from "@nestjs/common";
import { secondsInMs } from "@c5/utils";
import { CLIENT_ORIGIN, LOCAL_CLIENT_ORIGIN } from "../constants";
import { args } from "../common/args";
import { Queue } from "../queue/queue";
import { Game } from "../game/game";
import { delay } from "../../utils/delay";

const logger = new Logger("events.gateway");

type ClientSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

interface Player {
  userId: string;
  socket: ClientSocket;
}

@WebSocketGateway({
  cors: {
    origin: args.local ? LOCAL_CLIENT_ORIGIN : CLIENT_ORIGIN,
  },
})
export class EventsGateway {
  private queue: Queue<Player>;
  private games = new Set<Game>();

  constructor() {
    this.queue = new Queue<Player>().initialize({
      onMatch: (...players) => {
        this.onMatch(...players);
      },
    });
  }

  @WebSocketServer()
  server: Server<
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData
  >;

  @SubscribeMessage("enqueue")
  handleEnqueue(@ConnectedSocket() client: ClientSocket) {
    logger.log("enqueue received");
    this.queue.enqueue({
      userId: client.id,
      socket: client,
    });
    return true;
  }

  @SubscribeMessage("hello")
  handleMessage(client: ClientSocket, data: string): string {
    logger.log("received hello! data = ", data);
    client.emit("noArg");
    return `Received data = ${data}`;
  }

  private async onMatch(player1: Player, player2: Player) {
    logger.log("onMatch");
    player1.socket.emit("matchFound", {
      you: {
        userId: player1.userId,
      },
      them: {
        userId: player2.userId,
      },
    });
    player2.socket.emit("matchFound", {
      you: {
        userId: player1.userId,
      },
      them: {
        userId: player2.userId,
      },
    });
    await delay(secondsInMs(3));
    this.games.add(
      new Game(player1.socket, player2.socket).initialize({
        onEndCallback: () => {
          this.onGameEnd();
        },
      })
    );
  }

  private onGameEnd() {
    logger.log("onGameEnd");
    // Do something. not sure what yet.
  }
}
