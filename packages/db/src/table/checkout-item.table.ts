import { column, table } from "../utils";

export type TB_CheckoutItem = typeof TB_checkoutItem;

export const TB_checkoutItem = table("checkout_item", {
  id: column.id,

  checkoutId: column.text("checkout_id").notNull(),

  name: column.text("name").notNull(),
  price: column.int("price").notNull(),
  quantity: column.int("quantity").notNull(),

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
