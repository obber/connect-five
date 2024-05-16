import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@c5/connection";
import { shouldDebugLog } from "@/lib/logging/debug";

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface ConnectionStoreValues {
  socket: TypedSocket | null;
}

interface ConnectionStoreActions {
  connect: () => TypedSocket;
}

type ConnectionStore = ConnectionStoreActions & ConnectionStoreValues;

export const useConnectionStore = create<ConnectionStore>()(
  devtools(
    (set) => ({
      socket: null,
      connect: () => {
        const socket = io("http://localhost:4000");
        set({ socket });
        return socket;
      },
    }),
    {
      enabled: shouldDebugLog(),
      name: "ConnectionStore",
    }
  )
);
