import { column, table } from "../utils";
import { TB_user } from "./user.table";

export type TB_Session = typeof TB_session;

export const TB_session = table("session", {
  id: column.text("id").primaryKey(),

  userId: column
    .text("user_id")
    .notNull()
    .references(() => TB_user.id),

  expiresAt: column.timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
});
