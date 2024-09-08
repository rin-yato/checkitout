import { column, table } from "../utils";
import { genId } from "../utils/id";
import type { CheckoutStatus, Currency } from "../utils/type";

export type TB_Checkout = typeof TB_checkout;

export const TB_checkout = table("checkout", {
  id: column.id.$defaultFn(genId("ch")),

  refId: column.text("ref_id").notNull(),
  userId: column.text("user_id").notNull(),

  // items: [...]
  currency: column.text("currency").$type<Currency>().notNull(),
  subTotal: column.int("sub_total").notNull(),
  discount: column.int("discount").default(0),
  tax: column.int("tax").default(0),
  total: column.int("total").notNull(),

  clientName: column.text("client_name").notNull(),
  clientPhone: column.text("client_phone").notNull(),
  clientAddress: column.text("client_address"),

  status: column.text("status").$type<CheckoutStatus>().default("IDLE"),

  // transaction: [...]

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
