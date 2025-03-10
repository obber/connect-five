"use client";

import { useEffect, useState } from "react";
import { useConnectionStore } from "@/features/connection/store";
import { useSignIn } from "@/features/auth/hooks/use-sign-in";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { useIsSignedIn } from "@/features/auth/hooks/use-is-signed-in";
import { Game } from "@/features/game/components/game";

/* eslint-disable no-console -- fine */

export default function Page() {
  const { socket, connect } = useConnectionStore((s) => s);
  const signIn = useSignIn();
  const signOut = useSignOut();
  const isSignedIn = useIsSignedIn();
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    console.info("connecting");
    const sock = connect();

    return () => {
      sock.off("noArg");
      sock.disconnect();
    };
  }, [connect]);

  const handleClick = async () => {
    console.info("emitting enqueue");
    const result = await socket?.emitWithAck("enqueue", "foobar");
    console.info("enqueue ack, result  = ", result);
    socket?.on("matchFound", (payload) => {
      console.log("match found payload = ", payload);
    });
    socket?.on("initGame", () => {
      setShowGame(true);
    });
  };

  if (showGame) {
    return <Game />;
  }

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
        Queue me up!
      </button>
    </div>
  );
}
