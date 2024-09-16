import { DefaultCatchBoundary } from "@/component/default-catch-boundary";
import { NotFound } from "@/component/not-found";
import type { AuthContext } from "@/provider/auth.provider";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

export interface RouterContext {
  queryClient: QueryClient;
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  errorComponent: DefaultCatchBoundary,
});

function RootComponent() {
  return (
    <Fragment>
      <Outlet />
      <ScrollRestoration />
    </Fragment>
  );
}
