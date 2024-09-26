import { z } from "zod";

export const CURRENCY = z.union([z.literal("USD"), z.literal("KHR")]);
export type Currency = z.infer<typeof CURRENCY>;

export const DISCOUNT_TYPE = z.union([z.literal("PERCENT"), z.literal("AMOUNT")]);
export type DiscountType = z.infer<typeof DISCOUNT_TYPE>;
