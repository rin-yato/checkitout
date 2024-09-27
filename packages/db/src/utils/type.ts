export const CHECKOUT_STATUS = ["IDLE", "PENDING", "SUCCESS", "FAILED"] as const;
export const TRANSACTION_STATUS = ["TIMEOUT", "PENDING", "SUCCESS", "FAILED"] as const;
export const CURRENCY = ["USD", "KHR"] as const;
export const DISCOUNT = ["PERCENTAGE", "AMOUNT"] as const;

export type DiscountType = (typeof DISCOUNT)[number];
export type CheckoutStatus = (typeof CHECKOUT_STATUS)[number];
export type TransactionStatus = (typeof TRANSACTION_STATUS)[number];
export type Currency = (typeof CURRENCY)[number];
