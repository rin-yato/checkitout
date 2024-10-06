import { z } from "zod";

export const CURRENCY = z.union([z.literal("USD"), z.literal("KHR")]);
export type Currency = z.infer<typeof CURRENCY>;

export const DISCOUNT_TYPE = z.union([z.literal("PERCENTAGE"), z.literal("AMOUNT")]).nullable();
export type DiscountType = z.infer<typeof DISCOUNT_TYPE>;

export const TRANSACTION_STATUS = z.union([
  z.literal("PENDING"),
  z.literal("SUCCESS"),
  z.literal("FAILED"),
  z.literal("TIMEOUT"),
]);

export type TransactionStatus = z.infer<typeof TRANSACTION_STATUS>;
