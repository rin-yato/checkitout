import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TB_checkoutItem } from "../table";
import type { z } from "zod";

export const checkoutItemSchema = createSelectSchema(TB_checkoutItem);

export const checkoutItemInsert = createInsertSchema(TB_checkoutItem);
export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CheckoutItemInsert = z.infer<typeof checkoutItemInsert>;
export type CheckoutItemUpdate = Partial<CheckoutItemInsert>;
