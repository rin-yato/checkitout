import { api } from "@/lib/api";
import type { Token } from "@repo/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tokenKey } from "./token.config";

function createToken(name: string) {
  return api.post("v1/token", { json: { name } }).json<Token>();
}

export function useCreateTokenMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createToken,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tokenKey.list() });
    },
  });
}

function deleteToken(token: string) {
  return api.delete(`v1/token/${token}`).json<Token>();
}

export function useDeleteTokenMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteToken,
    onMutate: (tokenName) => {
      queryClient.cancelQueries({ queryKey: tokenKey.list() });
      queryClient.setQueryData<Token[]>(tokenKey.list(), (old) => {
        if (!old) return old;
        return old.filter((t) => t.name !== tokenName);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tokenKey.list() });
    },
  });
}
