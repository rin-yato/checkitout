import type { Prettify } from "@/type/utils";

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keysToOmit: K[],
): Prettify<Omit<T, K>> {
  const entries = Object.entries(obj);
  const filteredEntries = entries.filter(([key]) => !keysToOmit.includes(key as K));
  return Object.fromEntries(filteredEntries) as Omit<T, K>;
}
