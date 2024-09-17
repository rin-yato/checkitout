import { queryOptions, useQuery } from "@tanstack/react-query";
import { tokenKey } from "./token.config";
import { api } from "@/lib/api";
import type { Token } from "@repo/db/schema";
import { queryClient } from "@/provider/query-client.provider";

function getManyToken() {
  return api.get("v1/token").json<Token[]>();
}

export const tokenListQuery = () =>
  queryOptions({
    queryKey: tokenKey.list(),
    queryFn: getManyToken,
  });

export function prefetchTokenList() {
  return queryClient.prefetchQuery(tokenListQuery());
}

export function useTokenList() {
  return useQuery(tokenListQuery());
}
