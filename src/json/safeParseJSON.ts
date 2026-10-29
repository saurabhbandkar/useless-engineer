/**
 * Parses JSON without throwing. Returns `fallback` (or `undefined`) when the
 * input is not a string or is not valid JSON.
 *
 * The result is NOT validated: `T` is a promise from you, not a check.
 * Validate untrusted data before relying on its shape.
 */
export function safeParseJSON<T>(text: string | null | undefined, fallback: T): T;
export function safeParseJSON<T = unknown>(text: string | null | undefined): T | undefined;
export function safeParseJSON<T>(text: string | null | undefined, fallback?: T): T | undefined {
  if (typeof text !== "string") return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}
