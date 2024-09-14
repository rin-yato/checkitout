import { defineConfig } from "drizzle-kit";

const config = defineConfig({
  dialect: "postgresql",
  schema: "./packages/db/src/table/index.ts",
  verbose: true,
  strict: true,
  out: "./packages/db/src/migration/migrations",
  dbCredentials: {
    // @ts-ignore
    url: process.env.DB_URL,
  },
});

export default config;
