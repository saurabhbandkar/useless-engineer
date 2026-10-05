import { test } from "node:test";
import assert from "node:assert/strict";
import { debounce } from "../src/async/debounce";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

test("debounce fires once, with the last args", async () => {
  const calls: number[] = [];
  const d = debounce((n: number) => calls.push(n), 30);
  d(1); d(2); d(3);
  await wait(60);
  assert.deepEqual(calls, [3]);
});

test("debounce.cancel drops the pending call", async () => {
  let n = 0;
  const d = debounce(() => n++, 30);
  d();
  d.cancel();
  await wait(60);
  assert.equal(n, 0);
});
