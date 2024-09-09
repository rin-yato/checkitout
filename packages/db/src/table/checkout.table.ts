import { relations } from "drizzle-orm";
import { column, table } from "../utils";
import { genId } from "../utils/id";
import { CHECKOUT_STATUS, CURRENCY } from "../utils/type";
import { TiDBServerlessSession } from "drizzle-orm/tidb-serverless";
import { TB_transaction } from "./transaction.table";
import { TB_checkoutItem } from "./checkout-item.table";
import { TB_user } from "./user.table";

export type TB_Checkout = typeof TB_checkout;

export const TB_checkout = table("checkout", {
  id: column.id.$defaultFn(genId("ch")),

  refId: column.text("ref_id").notNull(),
  userId: column.text("user_id").notNull(),

  // items: [...]
  currency: column.text("currency", { enum: CURRENCY }).notNull(),
  subTotal: column.real("sub_total").notNull(),
  discount: column.real("discount").default(0),
  tax: column.real("tax").default(0),
  total: column.real("total").notNull(),

  clientName: column.text("client_name").notNull(),
  clientPhone: column.text("client_phone").notNull(),
  clientAddress: column.text("client_address"),

  additionalInfo: column.text("additional_info", { mode: "json" }),

  status: column.text("status", { enum: CHECKOUT_STATUS }).default("IDLE"),

  // transaction: [...]

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const checkoutRelations = relations(TB_checkout, ({ many, one }) => ({
  transactions: many(TB_transaction),
  items: many(TB_checkoutItem),
  user: one(TB_user, {
    fields: [TB_checkout.userId],
    references: [TB_user.id],
  }),
}));
