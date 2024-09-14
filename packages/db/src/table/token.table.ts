import { column, table } from "../utils";
import { TB_user } from "./user.table";

export const TB_token = table("token", {
  token: column.text("token").primaryKey(),
  userId: column
    .text("userId")
    .references(() => TB_user.id)
    .notNull(),
  ttl: column.timestamp("ttl", { withTimezone: true, mode: "date" }),
  createdAt: column.createdAt,
  deletedAt: column.deletedAt,
});
