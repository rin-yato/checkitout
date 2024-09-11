// run a promise with retries
export async function withRetry<T extends () => Promise<any>>(
  promise: T,
  retries = 3,
): Promise<Awaited<ReturnType<T>>> {
  return promise().catch((err) => {
    if (retries === 0) throw err;
    return withRetry(promise, retries - 1);
  });
}
