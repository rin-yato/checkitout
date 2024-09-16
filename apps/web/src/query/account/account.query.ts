import { api } from "@/lib/api";
import type { User } from "@repo/db/schema";
import { useQuery } from "@tanstack/react-query";
import { accountKey } from "./account.config";

async function getAccount() {
  return api.get("auth/me").json<User>();
}

export function useAccountQuery() {
  return useQuery({
    queryKey: [accountKey],
    queryFn: getAccount,
    retry: 1,
  });
}
