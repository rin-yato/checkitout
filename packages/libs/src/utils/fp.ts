/**
 * A function that takes no arguments and returns a value.
 * This is useful for running a scoped block of code.
 *
 * @example
 * const value = scoped(() => {
 *    return 'value' + 1;
 * });
 * console.log(value); // 'value1'
 **/
export function scoped<Fn extends () => unknown>(fn: Fn): ReturnType<Fn> {
  return fn() as ReturnType<Fn>;
}

export function noop() {}
