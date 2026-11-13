import { test } from "node:test";
import assert from "node:assert/strict";
import { settle, getOrDefault } from "../src/async/settle";

test("settle splits values and errors, in order", async () => {
  const { values, errors } = await settle([
    Promise.resolve(1),
    Promise.reject(new Error("a")),
    2,
    Promise.reject(new Error("b")),
  ]);
  assert.deepEqual(values, [1, 2]);
  assert.deepEqual(
    errors.map((e) => (e as Error).message),
    ["a", "b"],
  );
});

test("settle keeps raw results so you can tell which input failed", async () => {
  const { results } = await settle([
    Promise.resolve("ok"),
    Promise.reject("no"),
  ]);
  assert.equal(results[0]!.status, "fulfilled");
  assert.equal(results[1]!.status, "rejected");
});

test("settle never rejects, even when everything fails", async () => {
  const { values, errors } = await settle([
    Promise.reject(1),
    Promise.reject(2),
  ]);
  assert.deepEqual(values, []);
  assert.deepEqual(errors, [1, 2]);
});

test("getOrDefault returns the value or the per-field fallback", async () => {
  const [user, orders] = await Promise.allSettled([
    Promise.resolve({ name: "a" }),
    Promise.reject(new Error("down")),
  ]);
  assert.deepEqual(getOrDefault(user!, null), { name: "a" });
  assert.deepEqual(getOrDefault(orders!, [] as string[]), []);
});

test("getOrDefault keeps valid falsy values", async () => {
  const [r] = await Promise.allSettled([Promise.resolve(0)]);
  assert.equal(getOrDefault(r!, 99), 0);
});
