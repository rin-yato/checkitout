import { column, table } from "../utils";
import { genId } from "../utils/id";

export type TB_CheckoutItem = typeof TB_checkoutItem;

export const TB_checkoutItem = table("checkout_item", {
  id: column.id.$defaultFn(genId("chi")),

  checkoutId: column.text("checkout_id").notNull(),

  productId: column.text("product_id").notNull(),
  name: column.text("name").notNull(),
  price: column.real("price").notNull(),
  quantity: column.int("quantity").notNull(),

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
