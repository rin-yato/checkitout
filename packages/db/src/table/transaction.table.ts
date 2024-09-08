import { column, table } from "../utils";
import type { TransactionStatus } from "../utils/type";

export type TB_Transaction = typeof TB_transaction;

export const TB_transaction = table("transaction", {
  id: column.id,

  checkoutId: column.text("checkout_id").notNull(),

  md5: column.text("md5").notNull().unique(),
  qrCode: column.text("qr_code").notNull().unique(),

  amount: column.int("amount").notNull(),
  currency: column.text("currency").notNull(),

  status: column.text("status").$type<TransactionStatus>().notNull(),

  // ref: ref to the transaction data from bakong

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
