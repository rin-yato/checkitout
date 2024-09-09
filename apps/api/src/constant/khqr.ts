export const CURRENCY = ["USD", "KHR"] as const;
export type Currency = (typeof CURRENCY)[number];
