/** 节流 */
export const throttleAndDebounce = (fn: any, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>
  let called = false;

  return () => {
    if (timeout) clearTimeout(timeout);
    if (!called) {
      fn();
      called = true;

      setTimeout(() => {
        called = false;
      }, delay);
    } else {
      timeout = setTimeout(fn, delay);
    }
  }
}