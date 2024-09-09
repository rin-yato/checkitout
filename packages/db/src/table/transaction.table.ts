import { relations } from "drizzle-orm";
import { column, table } from "../utils";
import { genId } from "../utils/id";
import { TRANSACTION_STATUS } from "../utils/type";
import { TB_checkout } from "./checkout.table";

export type TB_Transaction = typeof TB_transaction;

export const TB_transaction = table("transaction", {
  id: column.id.$defaultFn(genId("trx")),

  checkoutId: column.text("checkout_id").notNull(),

  md5: column.text("md5").notNull().unique(),
  qrCode: column.text("qr_code").notNull().unique(),

  amount: column.int("amount").notNull(),
  currency: column.text("currency").notNull(),

  status: column.text("status", { enum: TRANSACTION_STATUS }).notNull().default("PENDING"),

  // ref: ref to the transaction data from bakong

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const transactionRelations = relations(TB_transaction, ({ one }) => ({
  checkout: one(TB_checkout, {
    fields: [TB_transaction.checkoutId],
    references: [TB_checkout.id],
  }),
}));
