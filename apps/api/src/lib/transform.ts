import type { Prettify } from "@/type/utils";

export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keysToOmit: K[],
  ignoreCase = false,
): Prettify<Omit<T, K>> {
  const entries = Object.entries(obj);
  const filteredEntries = entries.filter(([key]) =>
    keysToOmit.some((k) =>
      ignoreCase ? key.toLowerCase() === k.toString().toLowerCase() : key === k,
    ),
  );
  return Object.fromEntries(filteredEntries) as Omit<T, K>;
}
