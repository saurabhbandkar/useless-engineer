export interface SafeStringifyOptions {
  /** Indentation, same as the third argument of JSON.stringify. */
  space?: string | number;
}

/**
 * Like JSON.stringify, but never throws:
 * - circular references become "[Circular]" (shared, non-circular references are kept)
 * - BigInt values become strings
 * - anything else that throws (e.g. a failing toJSON) returns `undefined`
 *
 * Like JSON.stringify, returns `undefined` for top-level values with no JSON form
 * (undefined, functions, symbols).
 */
export function safeStringify(
  value: unknown,
  { space }: SafeStringifyOptions = {},
): string | undefined {
  const ancestors: unknown[] = [];

  function replacer(this: unknown, _key: string, val: unknown): unknown {
    if (typeof val === "bigint") return val.toString();
    if (typeof val !== "object" || val === null) return val;

    // `this` is the object currently being serialized; drop ancestors we've left.
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(val)) return "[Circular]";
    ancestors.push(val);
    return val;
  }

  try {
    return JSON.stringify(value, replacer, space);
  } catch {
    return undefined;
  }
}
