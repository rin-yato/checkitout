import { relations } from "drizzle-orm";
import { column, table } from "../utils";
import { genId } from "../utils/id";
import { TB_checkout } from "./checkout.table";

export type TB_user = typeof TB_user;

export const TB_user = table("user", {
  id: column.id.$defaultFn(genId("user")),

  googleId: column.text("google_id").unique(),

  displayName: column.text("display_name").notNull(),
  username: column.text("username").notNull().unique(),
  profile: column.text("profile"),
  email: column.text("email").notNull().unique(),

  bakongId: column.text("bakong_id").notNull().default(""),
  address: column.text("address").notNull().default(""),
  phone: column.text("phone").notNull().default(""),

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const userRelations = relations(TB_user, ({ many }) => ({
  checkouts: many(TB_checkout),
}));
