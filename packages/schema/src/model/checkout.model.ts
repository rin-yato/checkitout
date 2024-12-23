import { z } from "zod";
import { CURRENCY, DISCOUNT_TYPE } from "../utils";
import { publicCheckoutItemSchema } from "./checkout-item.model";

export const checkoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  refId: z.string(),

  currency: CURRENCY,
  discountType: DISCOUNT_TYPE,
  discount: z.number().positive().nullable(),
  tax: z.number().positive().nullable(),
  subTotal: z.number().positive(),
  total: z.number().positive(),

  clientName: z.string(),
  clientPhone: z.string(),
  clientAddress: z.string().nullable(),

  redirectUrl: z.string().url().nullish(),

  additionalInfo: z.record(z.string(), z.any()).nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const publicCheckoutSchema = checkoutSchema.pick({
  id: true,
  refId: true,
  currency: true,
  discountType: true,
  discount: true,
  tax: true,
  subTotal: true,
  total: true,
  clientName: true,
  clientPhone: true,
  clientAddress: true,
  redirectUrl: true,
  additionalInfo: true,
  createdAt: true,
  updatedAt: true,
});

export const publicCheckoutWithItemsSchema = publicCheckoutSchema.extend({
  items: z.array(publicCheckoutItemSchema).min(1, "Checkout must have at least 1 product"),
});

export const checkoutInsertSchema = checkoutSchema
  .pick({
    tax: true,
    total: true,
    subTotal: true,
    discount: true,
    discountType: true,
    currency: true,
    clientName: true,
    clientPhone: true,
    clientAddress: true,
    redirectUrl: true,
    additionalInfo: true,
  })
  .extend({
    tax: z.number().positive().nullish(),
    discount: z.number().positive().nullish(),
    discountType: DISCOUNT_TYPE.optional(),
    clientAddress: z.string().nullish(),
    additionalInfo: z.record(z.string(), z.any()).nullish(),
  });

export type Checkout = z.infer<typeof checkoutSchema>;
export type PublicCheckout = z.infer<typeof publicCheckoutSchema>;
export type PublicCheckoutWithItems = z.infer<typeof publicCheckoutWithItemsSchema>;
export type CheckoutInsert = z.infer<typeof checkoutInsertSchema>;
