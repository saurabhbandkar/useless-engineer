export interface ThrottleOptions {
  /** Fire immediately on the first call of a burst. Default: true */
  leading?: boolean;
  /** Fire once more at the end of the burst with the latest args. Default: true */
  trailing?: boolean;
}

export interface Throttled<A extends unknown[]> {
  (...args: A): void;
  /** Drop any pending trailing call and reset. */
  cancel: () => void;
}

/**
 * Runs `fn` at most once per `interval` ms, however often it's called.
 * Leading edge keeps UI snappy; trailing edge preserves the final update.
 */
export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  interval: number,
  { leading = true, trailing = true }: ThrottleOptions = {},
): Throttled<A> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: A | undefined;
  let lastRun = 0;

  const run = (args: A) => {
    lastRun = Date.now();
    fn(...args);
  };

  const throttled = (...args: A) => {
    const now = Date.now();
    if (lastRun === 0 && !leading) lastRun = now;
    const remaining = interval - (now - lastRun);

    if (remaining <= 0) {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      lastArgs = undefined;
      run(args);
    } else if (trailing) {
      lastArgs = args;
      if (timer === undefined) {
        timer = setTimeout(() => {
          timer = undefined;
          const a = lastArgs;
          lastArgs = undefined;
          if (a) run(a);
        }, remaining);
      }
    }
  };

  throttled.cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    lastArgs = undefined;
    lastRun = 0;
  };

  return throttled;
}
