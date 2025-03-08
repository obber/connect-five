export interface QueuePlayer {
  userId: string;
}

export type OnMatchHandler<T extends QueuePlayer> = (
  player1: T,
  player2: T
) => void;
