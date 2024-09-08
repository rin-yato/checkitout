import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../table";
import { createDBClient } from "./init";

const squealite = createDBClient({
  url: process.env.DB_URL ?? "",
  authToken: process.env.DB_TOKEN ?? "",
});

const drizzleClient = drizzle(squealite, { schema });

async function main() {
  for (const table in drizzleClient._.tableNamesMap) {
    squealite.execute(`DROP TABLE IF EXISTS ${table}`);
    console.log(`❌ Dropped table ${table}`);
  }
}

main();
