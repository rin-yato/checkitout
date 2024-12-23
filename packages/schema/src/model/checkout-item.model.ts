import { z } from "zod";
import { DISCOUNT_TYPE } from "../utils";

export const checkoutItemSchema = z.object({
  id: z.string(),
  checkoutId: z.string(),
  productId: z.string().nullable(),
  name: z.string(),
  img: z.string().url("Invalid product image URL"),
  price: z.number().positive(),
  quantity: z.number().positive(),

  discountType: DISCOUNT_TYPE,
  discount: z.number().positive().nullable(),

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

export const checkoutItemInsertSchema = checkoutItemSchema
  .pick({
    discountType: true,
    discount: true,
    quantity: true,
    price: true,
    img: true,
    name: true,
    productId: true,
  })
  .extend({
    productId: z.string().nullish(),
    discountType: DISCOUNT_TYPE.optional(),
    discount: z.number().positive().nullish(),
  });

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type PublicCheckoutItem = z.infer<typeof publicCheckoutItemSchema>;
export type CheckoutItemInsert = z.infer<typeof checkoutItemInsertSchema>;
