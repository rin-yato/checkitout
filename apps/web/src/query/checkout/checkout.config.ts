export const checkoutKey = {
  all: ["@checkout"] as const,
  list: (opts: unknown) => [...checkoutKey.all, "list", opts] as const,
  detail: (checkoutId: string) => [...checkoutKey.all, "detail", checkoutId] as const,
};
