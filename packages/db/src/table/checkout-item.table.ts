import { relations } from "drizzle-orm";
import { column, table } from "../utils";
import { genId } from "../utils/id";
import { TB_checkout } from "./checkout.table";

export type TB_CheckoutItem = typeof TB_checkoutItem;

export const TB_checkoutItem = table("checkout_item", {
  id: column.id.$defaultFn(genId("chi")),

  checkoutId: column
    .text("checkout_id")
    .notNull()
    .references(() => TB_checkout.id),

  productId: column.text("product_id").notNull(),
  name: column.text("name").notNull(),
  img: column.text("img").notNull(),
  price: column.real("price").notNull(),
  quantity: column.int("quantity").notNull(),

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const checkoutItemRelations = relations(TB_checkoutItem, ({ one }) => ({
  checkout: one(TB_checkout, {
    fields: [TB_checkoutItem.checkoutId],
    references: [TB_checkout.id],
  }),
}));
