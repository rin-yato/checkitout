import type { z } from "zod";
import { TB_transaction } from "../table";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { transactionRefSchema } from "./transaction-ref.schema";

export const transactionSchema = createSelectSchema(TB_transaction);
export const transactionInsert = createInsertSchema(TB_transaction);

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionInsert = z.infer<typeof transactionInsert>;

export const transactionWithRef = transactionSchema.extend({
  transactionRef: transactionRefSchema,
});
