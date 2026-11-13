/**
 * Deep-copies `value` so nothing nested is shared with the original
 * (unlike `{ ...obj }`, which only copies the top level).
 *
 * Handles plain objects, arrays, Date, RegExp, Map, Set, typed arrays,
 * ArrayBuffer, circular references, and shared references (an object used
 * twice stays shared once in the copy). Class instances keep their prototype,
 * getters/setters are copied as-is (never invoked), and symbol keys are kept.
 *
 * Functions, Promises, WeakMap and WeakSet cannot be cloned and are returned
 * by reference. One implementation on every platform, so behaviour doesn't
 * depend on whether `structuredClone` exists (older React Native engines).
 */
export function deepClone<T>(value: T): T {
  return clone(value, new WeakMap()) as T;
}

function clone(value: unknown, seen: WeakMap<object, unknown>): unknown {
  if (typeof value !== "object" || value === null) return value; // primitives, functions

  const cached = seen.get(value);
  if (cached !== undefined) return cached;

  if (value instanceof Date) return new Date(value.getTime());

  if (value instanceof RegExp) {
    const copy = new RegExp(value.source, value.flags);
    copy.lastIndex = value.lastIndex;
    return copy;
  }

  if (value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy);
    value.forEach((v, k) => copy.set(clone(k, seen), clone(v, seen)));
    return copy;
  }

  if (value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    value.forEach((v) => copy.add(clone(v, seen)));
    return copy;
  }

  if (Array.isArray(value)) {
    const copy: unknown[] = new Array(value.length);
    seen.set(value, copy);
    for (let i = 0; i < value.length; i++) {
      if (i in value) copy[i] = clone(value[i], seen); // keeps holes as holes
    }
    return copy;
  }

  if (value instanceof ArrayBuffer) return value.slice(0);

  if (ArrayBuffer.isView(value)) {
    if (value instanceof DataView) {
      const buf = value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
      return new DataView(buf as ArrayBuffer);
    }
    return (value as unknown as { slice(): unknown }).slice();
  }

  if (
    value instanceof Promise ||
    value instanceof WeakMap ||
    value instanceof WeakSet
  ) {
    return value; // no meaningful way to copy these
  }

  // Plain objects, class instances, errors: keep prototype, copy every own property.
  const copy = Object.create(Object.getPrototypeOf(value)) as object;
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) {
    const desc = Object.getOwnPropertyDescriptor(value, key)!;
    if ("value" in desc) desc.value = clone(desc.value, seen);
    Object.defineProperty(copy, key, desc);
  }
  return copy;
}
