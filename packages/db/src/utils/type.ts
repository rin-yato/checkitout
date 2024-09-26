export type CheckoutStatus = "IDLE" | "PENDING" | "SUCCESS" | "FAILED";
export type TransactionStatus = "TIMEOUT" | "PENDING" | "SUCCESS" | "FAILED";
export type Currency = "USD" | "KHR";

export const CHECKOUT_STATUS = ["IDLE", "PENDING", "SUCCESS", "FAILED"] as const;
export const TRANSACTION_STATUS = ["TIMEOUT", "PENDING", "SUCCESS", "FAILED"] as const;
export const CURRENCY = ["USD", "KHR"] as const;
export const DISCOUNT = ["PERCENTAGE", "AMOUNT"] as const;
