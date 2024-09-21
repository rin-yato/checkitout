import {
  boolean,
  doublePrecision,
  integer,
  json,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * A helper for defining columns.
 */
export const column = {
  int: integer,
  text: text,
  varchar: varchar,
  real: real,
  double: doublePrecision,
  boolean: boolean,
  json: json,
  timestamp: timestamp,
  enum: pgEnum,
  id: text("id").notNull().primaryKey(),
  deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const table = pgTable;
