export interface DelayOptions {
  /** Abort to stop waiting early. The promise rejects with `signal.reason`. */
  signal?: AbortSignal;
}

/**
 * Resolves after `ms` milliseconds.
 *
 * Unlike a bare `setTimeout`, it rejects bad input (NaN, negative, Infinity)
 * instead of silently firing immediately, and it can be cancelled.
 */
export function delay(ms: number, { signal }: DelayOptions = {}): Promise<void> {
  if (typeof ms !== "number" || !Number.isFinite(ms) || ms < 0) {
    return Promise.reject(
      new RangeError(`delay: expected a finite, non-negative number of ms, got ${String(ms)}`),
    );
  }
  if (signal?.aborted) return Promise.reject(signal.reason);

  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal!.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
