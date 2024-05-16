// eslint-disable-next-line unicorn/prefer-node-protocol -- not sure if this affects browser env.
import assert from "assert";
import { isNotNullOrUndefined } from "./guards";

export function first<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  return arr[0];
}

export function firstx<T>(arr: T[]): T {
  const val = first(arr);
  assert(isNotNullOrUndefined(val), "Expected non-empty array");

  return val;
}

export function last<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  return arr[arr.length - 1];
}

export function lastx<T>(arr: T[]): T {
  const val = last(arr);
  assert(isNotNullOrUndefined(val), "Expected non-empty array");

  return val;
}

export function get<T>(arr: T[], index: number): T | undefined {
  return arr[index];
}

export function getx<T>(arr: T[], index: number): T {
  const val = get(arr, index);
  assert(
    isNotNullOrUndefined(val),
    `Expected array to have item at index ${index}`
  );
  return val;
}
