export interface Debounced<A extends unknown[]> {
  (...args: A): void;
  /** Drop any pending call. Call this from your effect cleanup. */
  cancel: () => void;
}

/**
 * Delays `fn` until `delay` ms have passed with no new calls.
 * Every call resets the timer; only the last one fires.
 */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  delay: number,
): Debounced<A> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: A) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };

  return debounced;
}
