import { relations } from "drizzle-orm";
import { column, table } from "../utils";
import { genId } from "../utils/id";
import { TB_checkout } from "./checkout.table";
import { TB_user } from "./user.table";

export const TB_webhook = table("webhook", {
  id: column.id.$defaultFn(genId("wh")),

  userId: column
    .text("user_id")
    .notNull()
    .references(() => TB_user.id),
  checkoutId: column
    .text("checkout_id")
    .notNull()
    .references(() => TB_checkout.id),

  status: column.int("status").notNull(),
  json: column.json("json"),

  createdAt: column.createdAt,
});

export const webhookRelations = relations(TB_webhook, ({ one }) => ({
  checkout: one(TB_checkout, {
    references: [TB_checkout.id],
    fields: [TB_webhook.checkoutId],
  }),
  user: one(TB_user, {
    references: [TB_user.id],
    fields: [TB_webhook.userId],
  }),
}));
