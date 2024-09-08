import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../table";

export type CreateDBClientConfig = {
  url: string;
  authToken: string;
};

export function createDBClient(config: CreateDBClientConfig) {
  return createClient(config);
}

export interface CreateDBConfig {
  url: string;
  authToken: string;
}

export function createDB(config: CreateDBConfig) {
  const client = createDBClient(config);
  return drizzle(client, { logger: true, schema });
}
