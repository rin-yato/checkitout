import { z } from "zod";
import { TB_checkout } from "../table";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const checkoutSchema = createSelectSchema(TB_checkout, {
  additionalInfo: z.record(z.string(), z.any()),
});

export const checkoutInsert = createInsertSchema(TB_checkout, {
  redirectUrl: z.string().url("Invalid redirect URL").nullable(),
  additionalInfo: z.record(z.string(), z.any()),
});

export type Checkout = z.infer<typeof checkoutSchema>;
export type CheckoutInsert = z.infer<typeof checkoutInsert>;
