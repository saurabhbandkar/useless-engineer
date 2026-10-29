import { test } from "node:test";
import assert from "node:assert/strict";
import { safeStringify } from "../src/json/safeStringify";

test("matches JSON.stringify for plain data", () => {
  const v = { a: 1, b: [1, 2, { c: "x" }], d: null };
  assert.equal(safeStringify(v), JSON.stringify(v));
});

test("circular references become [Circular] instead of throwing", () => {
  const a: Record<string, unknown> = { name: "a" };
  a.self = a;
  assert.equal(safeStringify(a), '{"name":"a","self":"[Circular]"}');
});

test("deep cycles are caught", () => {
  const a: any = { b: { c: {} } };
  a.b.c.back = a;
  assert.equal(safeStringify(a), '{"b":{"c":{"back":"[Circular]"}}}');
});

test("shared (non-circular) references are NOT flagged", () => {
  const shared = { x: 1 };
  assert.equal(safeStringify({ p: shared, q: shared }), '{"p":{"x":1},"q":{"x":1}}');
});

test("BigInt becomes a string", () => {
  assert.equal(safeStringify({ n: 10n }), '{"n":"10"}');
});

test("space option works", () => {
  assert.equal(safeStringify({ a: 1 }, { space: 2 }), '{\n  "a": 1\n}');
});

test("a throwing toJSON returns undefined", () => {
  const bad = { toJSON() { throw new Error("no"); } };
  assert.equal(safeStringify(bad), undefined);
});

test("top-level undefined returns undefined, like JSON.stringify", () => {
  assert.equal(safeStringify(undefined), undefined);
});
