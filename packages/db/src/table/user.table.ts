import { relations } from "drizzle-orm";
import { column, table } from "../utils";
import { genId } from "../utils/id";
import { TB_checkout } from "./checkout.table";
import { TB_checkoutSequence } from "./checkout-sequence.table";

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

  webhookUrl: column.text("webhook_url").notNull().default(""),
  waitBeforeRedirect: column.boolean("wait_before_redirect").notNull().default(true),

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const userRelations = relations(TB_user, ({ many, one }) => ({
  checkouts: many(TB_checkout),
  sequence: one(TB_checkoutSequence, {
    fields: [TB_user.id],
    references: [TB_checkoutSequence.userId],
  }),
}));
