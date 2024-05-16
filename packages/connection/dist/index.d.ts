interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}
interface ClientToServerEvents {
    hello: (data: string) => void;
}
interface InterServerEvents {
    ping: () => void;
}
interface SocketData {
    name: string;
    age: number;
}

export type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData };
