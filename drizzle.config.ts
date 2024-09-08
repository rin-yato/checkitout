import { defineConfig } from "drizzle-kit";

const config = defineConfig({
  dialect: "sqlite",
  schema: "./packages/db/src/table",
  out: "./packages/db/src/migration/migrations",
  driver: "turso",
  dbCredentials: {
    // @ts-ignore
    url: process.env.DB_URL,
    // @ts-ignore
    authToken: process.env.DB_TOKEN,
  },
});

export default config;
