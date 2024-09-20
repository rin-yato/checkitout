import type { Currency } from "./shared.type";

export type TransactionStatus = "TIMEOUT" | "PENDING" | "SUCCESS" | "FAILED";

export type Transaction = {
  id: string;
  checkoutId: string;

  md5: string;
  qrCode: string;

  amount: number;
  currency: Currency;

  status: TransactionStatus;

  createdAt: Date;
  updatedAt: Date;
};
