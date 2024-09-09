export const formatCurrency = (value: number, currency: "KHR" | "USD" = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
};
