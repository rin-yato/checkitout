import { useAccountQuery, type User } from "@/query/account/account.query";
import { type PropsWithChildren, createContext, useContext, useMemo } from "react";

export type AuthContext =
  | {
      _tag: "AUTHENTICATED";
      user: User;
    }
  | {
      _tag: "UNAUTHENTICATED";
    };

const AuthContext = createContext<AuthContext>({ _tag: "UNAUTHENTICATED" });

export function AuthProvider(props: PropsWithChildren) {
  const { data, isPending, status } = useAccountQuery();

  const auth = useMemo((): AuthContext => {
    if (!data || status === "error") return { _tag: "UNAUTHENTICATED" };
    return { _tag: "AUTHENTICATED", user: data };
  }, [data, status]);

  if (isPending) return null;

  return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>;
}

export function useInternalAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useInternalAuth must be used within an AuthProvider");
  }

  return context;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  if (context._tag === "UNAUTHENTICATED") {
    throw new Error("UNAUTHENTICATED");
  }

  return context.user;
}
