import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "@c5/connection";
import { Logger } from "@nestjs/common";
import { CLIENT_ORIGIN, LOCAL_CLIENT_ORIGIN } from "../constants";
import { args } from "../common/args";

const logger = new Logger("events.gateway");

@WebSocketGateway({
  cors: {
    origin: args.local ? LOCAL_CLIENT_ORIGIN : CLIENT_ORIGIN,
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server<
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData
  >;

  @SubscribeMessage("hello")
  handleMessage(
    client: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >,
    data: string
  ): string {
    logger.log("received hello! data = ", data);
    client.emit("noArg");
    return `Received data = ${data}`;
  }
}
