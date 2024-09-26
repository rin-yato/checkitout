import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TB_checkoutItem } from "../table";
import type { z } from "zod";

export const checkoutItemSchema = createSelectSchema(TB_checkoutItem);

export const checkoutItemInsert = createInsertSchema(TB_checkoutItem).refine((data) => {
  // if discountType is PERCENTAGE, discount must be between 0 and 100
  if (data.discountType === "PERCENTAGE") {
    if ((data.discount ?? 0) < 0 || (data.discount ?? 0) > 100) {
      return "Discount percentage must be between 0 and 100";
    }
  } else {
    if ((data.discount ?? 0) < 0) {
      return "Discount amount must be greater than or equal to 0";
    }
  }

  return true;
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CheckoutItemInsert = z.infer<typeof checkoutItemInsert>;
export type CheckoutItemUpdate = Partial<CheckoutItemInsert>;
