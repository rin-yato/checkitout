import { err, ok, type Result } from "@justmiracle/result";

// run a promise with retries
export async function withRetry<T extends () => any>(
  promise: T,
  retries = 3,
): Promise<Result<Awaited<ReturnType<T>>>> {
  return promise()
    .then(ok)
    .catch((e: unknown) => {
      if (retries === 0) return err(e);
      return withRetry(promise, retries - 1);
    });
}
