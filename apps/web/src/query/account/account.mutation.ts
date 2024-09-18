import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { accountKey } from "./account.config";
import type { UserUpdate } from "@repo/db/schema";
import type { User } from "./account.query";

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

async function updateUser(userUpdate: UserUpdate) {
  return api.patch("v1/user", { json: userUpdate }).json<User>();
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [accountKey] });
    },
    onMutate: ({ profile, ...data }) => {
      // if user change profile
      // let's not do any optimistic update
      if (profile) return;

      queryClient.setQueryData([accountKey], (oldData: User) => {
        return { ...oldData, ...data };
      });
    },
  });
}
