export const CURRENCY = ["USD", "KHR"] as const;
export type Currency = (typeof CURRENCY)[number];

export const TRANSACTION_RESPONSE = {
  NOT_FOUND: "Transaction could not be found. Please check and try again.",
  FAILED: "Transaction failed.",
  SUCCESS: "Getting transaction successfully.",
} as const;
