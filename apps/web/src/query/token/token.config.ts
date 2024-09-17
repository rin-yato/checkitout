export const tokenKey = {
  all: ["@token"] as const,
  list: () => [...tokenKey.all, "list"] as const,
};
