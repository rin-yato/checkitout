import { api } from "@/lib/api";
import type { FindManyCheckoutV1Response, FindOneCheckoutV1Response } from "@repo/schema";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { checkoutKey } from "./checkout.config";
import { queryClient } from "@/provider/query-client.provider";
import type { WithPagination } from "../utils";

function getManyCheckout(opts: CheckoutListQuery) {
  return api
    .get("v1/checkout", { searchParams: { page: opts.page, perPage: opts.perPage } })
    .json<FindManyCheckoutV1Response>();
}

type CheckoutListQuery = WithPagination<unknown>;

export const checkoutListQuery = (opts: CheckoutListQuery) =>
  queryOptions({
    queryKey: checkoutKey.list(opts),
    queryFn: () => getManyCheckout(opts),
  });

function getOneCheckout(checkoutId: string) {
  return api.get(`v1/checkout/${checkoutId}`).json<FindOneCheckoutV1Response>();
}

export const checkoutDetailQuery = (checkoutId: string) =>
  queryOptions({
    queryKey: checkoutKey.detail(checkoutId),
    queryFn: () => getOneCheckout(checkoutId),
  });

export function useCheckoutDetail(checkoutId: string) {
  return useQuery(checkoutDetailQuery(checkoutId));
}

export function prefetchCheckoutDetail(checkoutId: string) {
  return queryClient.prefetchQuery(checkoutDetailQuery(checkoutId));
}
