export class TimeoutError extends Error {
  constructor(message = "Operation timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Rejects with `TimeoutError` if `promise` hasn't settled within `ms`.
 *
 * Note: this stops *waiting*, it does not stop the underlying work.
 * To cancel a request too, pass an AbortSignal to it as well.
 */
export function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  message?: string,
): Promise<T> {
  if (typeof ms !== "number" || !Number.isFinite(ms) || ms < 0) {
    return Promise.reject(
      new RangeError(`withTimeout: expected a finite, non-negative number of ms, got ${String(ms)}`),
    );
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new TimeoutError(message ?? `Timed out after ${ms}ms`)),
      ms,
    );
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
