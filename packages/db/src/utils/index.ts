import { blob, int, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

function currentTime() {
  return new Date();
}

/**
 * A helper for defining columns.
 */
export const column = {
  int: int,
  text: text,
  real: real,
  blob: blob,
  integer: integer,
  id: text("id").notNull().primaryKey(),
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(currentTime),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(currentTime)
    .$onUpdateFn(currentTime),
};

export const table = sqliteTable;
