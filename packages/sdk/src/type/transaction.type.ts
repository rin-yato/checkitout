import type { PublicTransaction } from "@repo/schema";
import type { Currency, Equal, Expect } from "./shared.type";

export type TransactionStatus = "TIMEOUT" | "PENDING" | "SUCCESS" | "FAILED";

type TransactionTest = Expect<Equal<Transaction, PublicTransaction>>;

export type Transaction = {
  id: string;
  checkoutId: string;

  /**
   * MD5 hash of the transaction
   */
  md5: string;

  /**
   * KHQR code
   */
  qrCode: string;

  amount: number;

  /**
   * \@link [`Currency`](/docs/type#currency)
   */
  currency: Currency;

  /**
   * - `TIMEOUT`: The transaction has expired
   * - `PENDING`: The transaction is still pending
   * - `SUCCESS`: The transaction has been completed
   * - `FAILED`: The transaction has failed
   *
   * \@link [`TransactionStatus`](/docs/type#transactionstatus)
   */
  status: TransactionStatus;

  createdAt: Date;
  updatedAt: Date;
};
