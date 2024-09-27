import { z } from "zod";
import { publicUserSchema } from "../model";
import { publicCheckoutWithItemsSchema } from "../model/checkout.model";
import { publicTransactionSchema } from "../model/transaction.model";

export const checkoutPortalV1Response = z.object({
  user: publicUserSchema,
  checkout: publicCheckoutWithItemsSchema,
  activeTransaction: publicTransactionSchema.nullable(),
  hasSuccessfulTransaction: z.boolean(),
  hasSuccessfulWebhook: z.boolean(),
});

export type CheckoutPortalV1Response = z.infer<typeof checkoutPortalV1Response>;
