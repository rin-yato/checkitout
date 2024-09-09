import { createDBClient } from "./init";

const squealite = createDBClient({
  url: process.env.DB_URL ?? "",
  authToken: process.env.DB_TOKEN ?? "",
});

async function main() {
  const tableNames = await squealite
    .execute("select tbl_name from sqlite_master where type='table';")
    .then((res) => res.rows.map((r) => r[0]));

  await squealite.execute("PRAGMA foreign_keys = OFF;");
  for (const name of tableNames) {
    await squealite.execute(`DROP TABLE IF EXISTS \`${name}\`;`);
    console.log(`❌ Dropped table ${name}`);
  }
  await squealite.execute("PRAGMA foreign_keys = ON;");
  console.log("❌ Dropped all tables");
}

main();
