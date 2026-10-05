import { test } from "node:test";
import assert from "node:assert/strict";
import { throttle } from "../src/async/throttle";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

test("throttle fires on leading edge, then trailing with latest args", async () => {
  const calls: number[] = [];
  const t = throttle((n: number) => calls.push(n), 50);
  t(1); t(2); t(3);
  assert.deepEqual(calls, [1]);
  await wait(90);
  assert.deepEqual(calls, [1, 3]);
});

test("throttle trailing:false drops the final call", async () => {
  const calls: number[] = [];
  const t = throttle((n: number) => calls.push(n), 50, { trailing: false });
  t(1); t(2);
  await wait(90);
  assert.deepEqual(calls, [1]);
});

test("throttle leading:false waits for the trailing call", async () => {
  const calls: number[] = [];
  const t = throttle((n: number) => calls.push(n), 50, { leading: false });
  t(1);
  assert.deepEqual(calls, []);
  await wait(90);
  assert.deepEqual(calls, [1]);
});

test("throttle.cancel drops the pending trailing call", async () => {
  const calls: number[] = [];
  const t = throttle((n: number) => calls.push(n), 50);
  t(1); t(2);
  t.cancel();
  await wait(90);
  assert.deepEqual(calls, [1]);
});
