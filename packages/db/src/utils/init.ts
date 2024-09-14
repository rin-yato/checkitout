import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../table";
import postgres from "postgres";

export type CreateDBClientConfig = {
  url: string;
  max?: number;
};

export function createDBClient(config: CreateDBClientConfig) {
  return postgres(config.url, { max: config.max });
}

export type DBClient = ReturnType<typeof createDBClient>;

export function createDB(client: DBClient) {
  return drizzle(client, { schema });
}
