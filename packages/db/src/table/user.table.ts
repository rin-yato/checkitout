import { column, table } from "../utils";

export const TB_user = table("user", {
  id: column.text("id").notNull().primaryKey(),

  displayName: column.text("display_name").notNull(),
  username: column.text("username").notNull().unique(),

  profile: column.text("profile"),

  googleId: column.text("google_id").unique(),

  email: column.text("email").notNull().unique(),

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
