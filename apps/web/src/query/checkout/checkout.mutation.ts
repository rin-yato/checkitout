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
