import { api } from "@/lib/api";
import type { User as BaseUser, FileUpload } from "@repo/db/schema";
import { useQuery } from "@tanstack/react-query";
import { accountKey } from "./account.config";

export interface User extends Omit<BaseUser, "profile"> {
  profile: FileUpload | null;
}

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
