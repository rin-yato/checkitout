import { z } from "zod";
import { CURRENCY, TRANSACTION_STATUS } from "../utils";

export const transactionSchema = z.object({
  id: z.string(),
  checkoutId: z.string(),

  md5: z.string(),
  qrCode: z.string(),

  amount: z.number().positive(),
  currency: CURRENCY,

  status: TRANSACTION_STATUS,

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const publicTransactionSchema = transactionSchema.omit({
  deletedAt: true,
});

export type Transaction = z.infer<typeof transactionSchema>;
export type PublicTransaction = z.infer<typeof publicTransactionSchema>;
