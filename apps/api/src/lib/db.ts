import { createDB, createDBClient } from "@repo/db";
import { env } from "./env";

const client = createDBClient({ url: env.DB_URL });
export const db = createDB(client);

export type DB = typeof db;
export type Trx = Parameters<Parameters<DB["transaction"]>[0]>[0];
export type DBTrx = DB | Trx;

export function takeFirst<T>(data: T[]): T | undefined {
  return data.at(0);
}

export function takeFirstOrThrow<T>(data: T[]): T {
  if (data[0]) return data[0];
  throw new Error("Take first or throw failed: No data found");
}
