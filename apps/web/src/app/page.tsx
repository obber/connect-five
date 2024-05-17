"use client";

import { useEffect } from "react";
import { useConnectionStore } from "@/features/connection/store";
import { useSignIn } from "@/features/auth/hooks/use-sign-in";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { useIsSignedIn } from "@/features/auth/hooks/use-is-signed-in";

/* eslint-disable no-console -- fine */

export default function Page() {
  const { socket, connect } = useConnectionStore((s) => s);
  const signIn = useSignIn();
  const signOut = useSignOut();
  const isSignedIn = useIsSignedIn();

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
      {isSignedIn ? (
        <button onClick={signOut} type="button">
          Sign Out
        </button>
      ) : (
        <button onClick={signIn} type="button">
          Sign In
        </button>
      )}
      <button onClick={handleClick} type="button">
        Click me
      </button>
    </div>
  );
}
