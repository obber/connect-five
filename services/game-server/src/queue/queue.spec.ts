import { secondsInMs } from "@c5/utils";
import { Queue } from "./queue";

jest.useFakeTimers();

describe("Queue", () => {
  it("should do nothing if already in queue", () => {
    const onMatch = jest.fn();
    const queue = new Queue().initialize({ onMatch });
    queue.enqueue({ userId: "foo" });
    queue.enqueue({ userId: "foo" });
    jest.advanceTimersByTime(secondsInMs(3));
    expect(onMatch).not.toHaveBeenCalled();
  });

  it("should not match if there is only one person in the queue", () => {
    const onMatch = jest.fn();
    const queue = new Queue().initialize({ onMatch });
    queue.enqueue({ userId: "foo" });
    jest.advanceTimersByTime(secondsInMs(10));
    expect(onMatch).not.toHaveBeenCalled();
  });

  it("should match if there is two people in the queue", () => {
    const onMatch = jest.fn();
    const queue = new Queue().initialize({ onMatch });
    queue.enqueue({ userId: "foo" });

    jest.advanceTimersByTime(secondsInMs(3));
    expect(onMatch).not.toHaveBeenCalled();

    queue.enqueue({ userId: "bar" });
    jest.advanceTimersByTime(secondsInMs(3));
    expect(onMatch).toHaveBeenCalledWith({ userId: "foo" }, { userId: "bar" });
  });

  it("should match the first two people in the queue", () => {
    const onMatch = jest.fn();
    const queue = new Queue().initialize({ onMatch });
    queue.enqueue({ userId: "foo" });

    jest.advanceTimersByTime(secondsInMs(3));
    expect(onMatch).not.toHaveBeenCalled();

    queue.enqueue({ userId: "bar" });
    queue.enqueue({ userId: "yaz" });
    jest.advanceTimersByTime(secondsInMs(3));
    expect(onMatch).toHaveBeenCalledTimes(1);
    expect(onMatch).toHaveBeenCalledWith({ userId: "foo" }, { userId: "bar" });
  });

  it("should continue to match over time", () => {
    const onMatch = jest.fn();
    const queue = new Queue().initialize({ onMatch });
    queue.enqueue({ userId: "foo" });
    queue.enqueue({ userId: "bar" });
    queue.enqueue({ userId: "yaz" });

    jest.advanceTimersByTime(secondsInMs(3));
    expect(onMatch).toHaveBeenCalledTimes(1);
    expect(onMatch).toHaveBeenCalledWith({ userId: "foo" }, { userId: "bar" });

    queue.enqueue({ userId: "liz" });
    jest.advanceTimersByTime(secondsInMs(1));
    expect(onMatch).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(secondsInMs(2));
    expect(onMatch).toHaveBeenCalledTimes(2);
    expect(onMatch).toHaveBeenCalledWith({ userId: "yaz" }, { userId: "liz" });
  });
});
