"use client";

import { useEffect } from "react";
import { useConnectionStore } from "@/features/connection/store";

/* eslint-disable no-console -- fine */

export default function Page() {
  const { socket, connect } = useConnectionStore((s) => s);

  useEffect(() => {
    console.info("connecting");
    const sock = connect();
    sock.on("noArg", () => {
      console.info("RECEIVED: noArg");
    });

    return () => {
      sock.off("noArg");
      sock.disconnect();
    };
  }, [connect]);

  const handleClick = () => {
    console.info("emitting hello. socket = ", socket);
    socket?.emit("hello", "foobar!");
  };

  return (
    <div>
      <button onClick={handleClick} type="button">
        Click me
      </button>
    </div>
  );
}
