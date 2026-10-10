import { test } from "node:test";
import assert from "node:assert/strict";
import { withTimeout, TimeoutError } from "../src/async/withTimeout";

const later = <T>(value: T, ms: number) =>
  new Promise<T>((r) => setTimeout(() => r(value), ms));

test("withTimeout passes through a fast result", async () => {
  assert.equal(await withTimeout(later("ok", 10), 100), "ok");
});

test("withTimeout rejects with TimeoutError when too slow", async () => {
  await assert.rejects(withTimeout(later("late", 200), 20), TimeoutError);
});

test("withTimeout uses the custom message", async () => {
  await assert.rejects(withTimeout(later(1, 200), 20, "too slow"), /too slow/);
});

test("withTimeout forwards the original rejection", async () => {
  const failing = Promise.reject(new Error("boom"));
  await assert.rejects(withTimeout(failing, 100), /boom/);
});

test("withTimeout rejects invalid ms", async () => {
  await assert.rejects(withTimeout(later(1, 1), -5), RangeError);
});
