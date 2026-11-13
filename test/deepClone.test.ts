import { test } from "node:test";
import assert from "node:assert/strict";
import { deepClone } from "../src/object/deepClone";

test("nested objects are independent of the original", () => {
  const a = { user: { name: "a", tags: ["x"] } };
  const b = deepClone(a);
  b.user.name = "b";
  b.user.tags.push("y");
  assert.equal(a.user.name, "a");
  assert.deepEqual(a.user.tags, ["x"]);
});

test("primitives, null and undefined pass through", () => {
  assert.equal(deepClone(5), 5);
  assert.equal(deepClone(null), null);
  assert.equal(deepClone(undefined), undefined);
  assert.equal(deepClone("s"), "s");
});

test("Date, RegExp are copied, not shared", () => {
  const d = new Date(1000);
  const r = /ab+/gi;
  const [d2, r2] = deepClone([d, r]);
  assert.notEqual(d2, d);
  assert.equal(d2!.getTime(), 1000);
  assert.notEqual(r2, r);
  assert.equal((r2 as RegExp).source, "ab+");
  assert.equal((r2 as RegExp).flags, "gi");
});

test("Map and Set are deeply copied", () => {
  const inner = { n: 1 };
  const m = new Map([["k", inner]]);
  const s = new Set([inner]);
  const m2 = deepClone(m);
  const s2 = deepClone(s);
  assert.notEqual(m2.get("k"), inner);
  assert.deepEqual(m2.get("k"), { n: 1 });
  assert.notEqual([...s2][0], inner);
});

test("circular references are preserved, without infinite recursion", () => {
  const a: any = { name: "a" };
  a.self = a;
  const b = deepClone(a);
  assert.notEqual(b, a);
  assert.equal(b.self, b);
});

test("shared references stay shared inside the copy", () => {
  const shared = { x: 1 };
  const b = deepClone({ p: shared, q: shared });
  assert.equal(b.p, b.q);
  assert.notEqual(b.p, shared);
});

test("class instances keep their prototype", () => {
  class Point {
    constructor(
      public x: number,
      public y: number,
    ) {}
    sum() {
      return this.x + this.y;
    }
  }
  const p = deepClone(new Point(1, 2));
  assert.ok(p instanceof Point);
  assert.equal(p.sum(), 3);
});

test("functions are returned by reference", () => {
  const fn = () => 1;
  assert.equal(deepClone({ fn }).fn, fn);
});

test("symbol keys and getters are preserved (getter not invoked)", () => {
  const sym = Symbol("s");
  let calls = 0;
  const o = {
    [sym]: { v: 1 },
    get g() {
      calls++;
      return 1;
    },
  };
  const c = deepClone(o);
  assert.deepEqual(c[sym], { v: 1 });
  assert.notEqual(c[sym], o[sym]);
  assert.equal(calls, 0);
});

test("typed arrays and ArrayBuffer are copied", () => {
  const t = new Uint8Array([1, 2, 3]);
  const t2 = deepClone(t);
  t2[0] = 9;
  assert.equal(t[0], 1);
});

test("arrays keep holes and Errors keep their message", () => {
  // eslint-disable-next-line no-sparse-arrays
  const holey = [1, , 3];
  assert.equal(1 in deepClone(holey), false);
  const e = deepClone(new Error("boom"));
  assert.ok(e instanceof Error);
  assert.equal(e.message, "boom");
});
