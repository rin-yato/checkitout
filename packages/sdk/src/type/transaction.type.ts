import type { PublicTransaction } from "@repo/schema";
import type { Currency, Equal, Expect } from "./shared.type";

export type TransactionStatus = "TIMEOUT" | "PENDING" | "SUCCESS" | "FAILED";

type TransactionTest = Expect<Equal<Transaction, PublicTransaction>>;

export type Transaction = {
  id: string;
  checkoutId: string;

  md5: string;
  qrCode: string;

  amount: number;
  currency: Currency;

  status: TransactionStatus;
};
