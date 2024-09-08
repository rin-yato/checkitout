import { column, table } from "../utils";
import { genId } from "../utils/id";

export type TB_user = typeof TB_user;

export const TB_user = table("user", {
  id: column.id.$defaultFn(genId("user")),

  displayName: column.text("display_name").notNull(),
  username: column.text("username").notNull().unique(),

  profile: column.text("profile"),

  googleId: column.text("google_id").unique(),

  email: column.text("email").notNull().unique(),

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
