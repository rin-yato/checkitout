import { relations } from "drizzle-orm";
import { column, table } from "../utils";
import { genId } from "../utils/id";
import { CURRENCY, DISCOUNT } from "../utils/type";
import { TB_transaction } from "./transaction.table";
import { TB_checkoutItem } from "./checkout-item.table";
import { TB_user } from "./user.table";
import { TB_webhook } from "./webhook.table";
import { unique } from "drizzle-orm/pg-core";

export type TB_Checkout = typeof TB_checkout;
export const CHECKOUT_ID_PREFIX = "ch";

export const TB_checkout = table(
  "checkout",
  {
    id: column.id.$defaultFn(genId(CHECKOUT_ID_PREFIX)),

    userId: column
      .text("user_id")
      .notNull()
      .references(() => TB_user.id),

    refId: column.text("ref_id").notNull(),

    // items: [...]
    currency: column.text("currency", { enum: CURRENCY }).notNull(),
    subTotal: column.real("sub_total").notNull(),
    discountType: column.text("discount_type", { enum: DISCOUNT }),
    discount: column.real("discount"),
    tax: column.real("tax"),
    total: column.real("total").notNull(),

    clientName: column.text("client_name").notNull(),
    clientPhone: column.text("client_phone").notNull(),
    clientAddress: column.text("client_address"),

    additionalInfo: column.json("additional_info"),

    redirectUrl: column.text("redirect_url"),
    // transaction: [...]

    createdAt: column.createdAt,
    updatedAt: column.updatedAt,
    deletedAt: column.deletedAt,
  },
  (t) => ({
    uniqueRefIdPerUser: unique("unique_ref_id_per_user").on(t.userId, t.refId),
  }),
);

export const checkoutRelations = relations(TB_checkout, ({ many, one }) => ({
  transactions: many(TB_transaction),
  webhooks: many(TB_webhook),
  items: many(TB_checkoutItem),
  user: one(TB_user, {
    fields: [TB_checkout.userId],
    references: [TB_user.id],
  }),
}));
