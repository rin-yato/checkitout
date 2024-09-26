import { z } from "zod";
import { TB_checkout } from "../table";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const checkoutSchema = createSelectSchema(TB_checkout, {
  additionalInfo: z.record(z.string(), z.any()),
});

export const checkoutInsert = createInsertSchema(TB_checkout, {
  redirectUrl: z.string().url("Invalid redirect URL"),
  additionalInfo: z.record(z.string(), z.any()),
}).refine((data) => {
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

export type Checkout = z.infer<typeof checkoutSchema>;
export type CheckoutInsert = z.infer<typeof checkoutInsert>;
