import { column, table } from "../utils";

export type TB_Session = typeof TB_session;

export const TB_session = table("session", {
  id: column.text("id").primaryKey(),

  userId: column.text("user_id").notNull(),

  expiresAt: column.integer("expires_at").notNull(),
});
