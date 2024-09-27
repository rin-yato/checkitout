import { z } from "zod";
import { DISCOUNT_TYPE } from "../utils";

export const checkoutItemSchema = z.object({
  id: z.string(),
  checkoutId: z.string(),
  productId: z.string().nullable(),
  name: z.string(),
  img: z.string().url("Invalid product image URL"),
  price: z.number().int(),
  quantity: z.number().int(),

  discountType: DISCOUNT_TYPE,
  discount: z.number().int().nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const publicCheckoutItemSchema = checkoutItemSchema.pick({
  id: true,
  checkoutId: true,
  productId: true,
  name: true,
  img: true,
  price: true,
  quantity: true,
  discountType: true,
  discount: true,
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type PublicCheckoutItem = z.infer<typeof publicCheckoutItemSchema>;
