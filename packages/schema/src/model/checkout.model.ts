import { z } from "zod";
import { CURRENCY, DISCOUNT_TYPE } from "../utils";

export const checkoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  refId: z.string(),

  currency: CURRENCY,
  discountType: DISCOUNT_TYPE,
  discount: z.number().int(),
  tax: z.number().int(),
  subTotal: z.number().int(),
  total: z.number().int(),

  clientName: z.string(),
  clientPhone: z.string(),
  clientAddress: z.string().optional(),

  redirectUrl: z.string().url(),
});
