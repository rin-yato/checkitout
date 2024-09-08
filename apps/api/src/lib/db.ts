import { createDB } from "@repo/db";
import { env } from "./env";

export const db = createDB({
  url: env.DB_URL,
  authToken: env.DB_TOKEN,
});

export function takeFirst<T>(data: T[]): T | undefined {
  return data.at(0);
}

export function takeFirstOrThrow<T>(data: T[]): T {
  if (data[0]) return data[0];
  throw new Error("No data found");
}
