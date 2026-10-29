import { test } from "node:test";
import assert from "node:assert/strict";
import { safeParseJSON } from "../src/json/safeParseJSON";

test("parses valid JSON", () => {
  assert.deepEqual(safeParseJSON('{"a":1}', {}), { a: 1 });
});

test("returns the fallback on invalid JSON", () => {
  assert.deepEqual(safeParseJSON("{nope", { ok: false }), { ok: false });
});

test("returns undefined on invalid JSON when no fallback is given", () => {
  assert.equal(safeParseJSON("{nope"), undefined);
});

test("null / undefined input (e.g. AsyncStorage miss) returns the fallback", () => {
  assert.equal(safeParseJSON(null, "default"), "default");
  assert.equal(safeParseJSON(undefined, 5), 5);
});

test("empty string returns the fallback", () => {
  assert.equal(safeParseJSON("", []).length, 0);
});

test("a valid falsy JSON value is returned, not replaced by the fallback", () => {
  assert.equal(safeParseJSON("0", 99), 0);
  assert.equal(safeParseJSON("false", true), false);
  assert.equal(safeParseJSON("null", "x"), null);
});
