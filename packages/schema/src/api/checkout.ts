import { z } from "zod";
import { checkoutItemInsertSchema, publicCheckoutItemSchema, publicUserSchema } from "../model";
import {
  checkoutInsertSchema,
  publicCheckoutSchema,
  publicCheckoutWithItemsSchema,
} from "../model/checkout.model";
import { publicTransactionSchema } from "../model/transaction.model";

export const checkoutPortalV1Response = z.object({
  user: publicUserSchema,
  checkout: publicCheckoutWithItemsSchema,
  activeTransaction: publicTransactionSchema.nullable(),
  hasSuccessfulTransaction: z.boolean(),
  hasSuccessfulWebhook: z.boolean(),
});

export type CheckoutPortalV1Response = z.infer<typeof checkoutPortalV1Response>;

export const checkoutCreateV1Response = z.object({
  checkout: publicCheckoutSchema,
  items: z.array(publicCheckoutItemSchema),
  activeTransaction: publicTransactionSchema,
});

export type CheckoutCreateV1Response = z.infer<typeof checkoutCreateV1Response>;

export const checkoutCreateV1Body = checkoutInsertSchema.extend({
  items: z.array(checkoutItemInsertSchema, {
    description: "An array of items for this checkout",
  }),
});

export type CheckoutCreateV1Body = z.infer<typeof checkoutCreateV1Body>;
