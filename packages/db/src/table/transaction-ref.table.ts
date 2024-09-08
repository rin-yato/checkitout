import { column, table } from "../utils";

export type TB_TransactionRef = typeof TB_transactionRef;

export const TB_transactionRef = table("transaction_ref", {
  id: column.id,

  transactionId: column.text("transaction_id").notNull(),
  md5: column.text("md5").notNull(),
  qrCode: column.text("qr_code").notNull(),

  hash: column.text("hash").notNull().unique(),
  fromAccountId: column.text("from_account_id").notNull(),
  toAccountId: column.text("to_account_id").notNull(),
  currency: column.text("currency").notNull(),
  amount: column.int("amount").notNull(),
  description: column.text("description").notNull().default(""),

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
