import { createSelectSchema } from "drizzle-zod";
import { TB_transactionRef } from "../table";
import type { z } from "zod";

export const transactionRefSchema = createSelectSchema(TB_transactionRef);

export type TransactionRef = z.infer<typeof transactionRefSchema>;
