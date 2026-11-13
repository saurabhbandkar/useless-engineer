export interface Settled<T> {
  /** Values of the promises that fulfilled, in input order. */
  values: T[];
  /** Reasons of the promises that rejected, in input order. */
  errors: unknown[];
  /** The raw results, so you can tell which input failed. */
  results: PromiseSettledResult<T>[];
}

/**
 * Waits for every promise to finish and splits the outcome into
 * fulfilled values and errors. One failure never discards the rest.
 *
 * Use it for lists (uploads, batch requests). For a few named requests,
 * use `Promise.allSettled` with `getOrDefault`.
 */
export async function settle<T>(
  promises: Iterable<T | PromiseLike<T>>,
): Promise<Settled<Awaited<T>>> {
  const results = (await Promise.allSettled(promises)) as PromiseSettledResult<Awaited<T>>[];
  const values: Awaited<T>[] = [];
  const errors: unknown[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") values.push(r.value);
    else errors.push(r.reason);
  }
  return { values, errors, results };
}

/**
 * Reads one `Promise.allSettled` result with a per-field fallback,
 * so a failed request degrades one part of a screen instead of all of it.
 *
 *   const [user, orders] = await Promise.allSettled([getUser(), getOrders()]);
 *   render({ user: getOrDefault(user, null), orders: getOrDefault(orders, []) });
 */
export function getOrDefault<T, D>(result: PromiseSettledResult<T>, fallback: D): T | D {
  return result.status === "fulfilled" ? result.value : fallback;
}
