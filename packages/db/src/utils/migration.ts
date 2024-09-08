import path from "path";
import { drizzle } from "drizzle-orm/libsql";
import { migrate as migrateFn } from "drizzle-orm/libsql/migrator";
import * as schema from "../table";
import { createDBClient } from "../utils/init";

const squealite = createDBClient({
  url: process.env.DB_URL ?? "",
  authToken: process.env.DB_TOKEN ?? "",
});

const migrationDB = drizzle(squealite, { schema });

const migrationsFolder = path.resolve(__dirname, "../migration/migrations");

export async function migrate() {
  try {
    console.log("🍀 Migrating...");
    await migrateFn(migrationDB, { migrationsFolder });
    console.log("🎉 Migration ran successfully");
    return true;
  } catch (error) {
    console.error("❌ Migration failed", error);
    return false;
  }
}
