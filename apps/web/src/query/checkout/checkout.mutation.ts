import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutKey } from "./checkout.config";

function deleteCheckout(checkoutId: string) {
  return api.delete(`v1/checkout/${checkoutId}`).json<null>();
}

export function useDeleteCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCheckout,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: checkoutKey.all });
    },
  });
}

function retryCheckoutWebhook(checkoutId: string) {
  return api.post(`v1/checkout/${checkoutId}/retry-webhook`).json<null>();
}

export function useRetryCheckoutWebhookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: retryCheckoutWebhook,
    onSettled: (_, __, checkoutId) => {
      return queryClient.invalidateQueries({ queryKey: checkoutKey.detail(checkoutId) });
    },
  });
}
