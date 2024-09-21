import path from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as migrateFn } from "drizzle-orm/postgres-js/migrator";
import * as schema from "../table";
import { createDBClient } from "../utils/init";

const dbClient = createDBClient({ url: process.env.DB_URL ?? "", max: 1 });

const migrationDB = drizzle(dbClient, { schema });

const migrationsFolder = path.resolve(__dirname, "../migration/migrations");

export async function migrate() {
  try {
    console.log("🍀 Migrating...");
    await migrateFn(migrationDB, { migrationsFolder });
    console.log("🎉 Migration ran successfully");
  } catch (error) {
    console.error("❌ Migration failed");
    throw error;
  }
}
