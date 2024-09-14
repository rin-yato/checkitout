import { sql } from "drizzle-orm";
import { createDB, createDBClient } from "./init";

const dbClient = createDBClient({ url: process.env.DB_URL ?? "", max: 1 });
const db = createDB(dbClient);

async function main() {
  const query = sql`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `;

  await db.execute(query);

  console.log("❌ Dropped all tables");
}

main();
