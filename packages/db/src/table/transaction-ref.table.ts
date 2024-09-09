import { column, table } from "../utils";
import { genId } from "../utils/id";

export type TB_TransactionRef = typeof TB_transactionRef;

export const TB_transactionRef = table("transaction_ref", {
  id: column.id.$defaultFn(genId("trx_ref")),

  transactionId: column.text("transaction_id").notNull(),
  md5: column.text("md5").notNull(),
  qrCode: column.text("qr_code").notNull(),

  hash: column.text("hash").notNull().unique(),
  fromAccountId: column.text("from_account_id").notNull(),
  toAccountId: column.text("to_account_id").notNull(),
  currency: column.text("currency").notNull(),
  amount: column.real("amount").notNull(),
  description: column.text("description").notNull().default(""),

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
