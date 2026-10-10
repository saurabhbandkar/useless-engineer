import { test } from "node:test";
import assert from "node:assert/strict";
import { delay } from "../src/async/delay";

test("delay resolves after roughly ms", async () => {
  const start = Date.now();
  await delay(50);
  assert.ok(Date.now() - start >= 45);
});

test("delay rejects invalid input instead of firing instantly", async () => {
  for (const bad of [NaN, -1, Infinity, "10" as unknown as number]) {
    await assert.rejects(delay(bad), RangeError);
  }
});

test("delay(0) is allowed", async () => {
  await delay(0);
});

test("delay rejects when the signal aborts mid-wait", async () => {
  const ctrl = new AbortController();
  const p = delay(1000, { signal: ctrl.signal });
  setTimeout(() => ctrl.abort(new Error("stop")), 20);
  await assert.rejects(p, /stop/);
});

test("delay rejects immediately if the signal is already aborted", async () => {
  const ctrl = new AbortController();
  ctrl.abort(new Error("already"));
  await assert.rejects(delay(1000, { signal: ctrl.signal }), /already/);
});
