import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { accountKey } from "./account.config";

async function logout() {
  return await api.get("auth/logout").json();
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [accountKey] });
      await router.navigate({ to: "/login", __isRedirect: true });
    },
  });
}
