import { secondsInMs } from "@c5/utils";
import type { OnMatchHandler, QueuePlayer } from "./types";

const CHECK_INTERVAL_MS = secondsInMs(3);

export class Queue<T extends QueuePlayer> {
  private initialized = false;
  // For now, we'll use an array to simplify dequeueing. Eventually, we want to
  // actually sort the queue so that the players are sequenced by skill and
  // have an appropriate matching algorithm.
  private waitingForGame: T[] = [];
  private onMatch?: OnMatchHandler<T>;

  initialize({ onMatch }: { onMatch: OnMatchHandler<T> }): this {
    if (this.initialized) {
      return this;
    }
    this.onMatch = onMatch;
    this.initialized = true;
    setInterval(() => {
      this.matchAwaitingPlayers();
    }, CHECK_INTERVAL_MS);
    return this;
  }

  enqueue(player: T) {
    // Already in queue, do nothing. No need to send back an error because the
    // desired state is the same thing as the side effect of calling this
    // function.
    if (this.waitingForGame.find(({ userId }) => userId === player.userId)) {
      return;
    }

    this.waitingForGame.push(player);
  }

  private matchAwaitingPlayers() {
    const matches: [T, T][] = [];
    while (this.waitingForGame.length >= 2) {
      matches.push([
        /* eslint-disable @typescript-eslint/no-non-null-assertion -- We we check to make sure waitingForGame.length >= 2. */
        this.waitingForGame.shift()!,
        this.waitingForGame.shift()!,
        /* eslint-enable @typescript-eslint/no-non-null-assertion -- end */
      ]);
    }
    for (const match of matches) {
      this.onMatch?.(...match);
    }
  }
}
