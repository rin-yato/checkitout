// run a promise with retries
export async function withRetry<T extends () => any>(
  promise: T,
  retries = 3,
): Promise<Awaited<ReturnType<T>> | undefined> {
  return promise().catch(() => {
    if (retries === 0) return undefined;
    return withRetry(promise, retries - 1);
  });
}
