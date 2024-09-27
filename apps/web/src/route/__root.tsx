import { Confirmation } from "@/component/confirmation";
import { DefaultCatchBoundary } from "@/component/default-catch-boundary";
import { NotFound } from "@/component/not-found";
import type { AuthContext } from "@/provider/auth.provider";
import { Portal } from "@radix-ui/themes";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { CheckmarkIcon, ErrorIcon } from "react-hot-toast";
import { Fragment } from "react/jsx-runtime";
import { Toaster } from "sonner";

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
      <Portal>
        <Confirmation />
        <Toaster
          icons={{ success: <CheckmarkIcon />, error: <ErrorIcon /> }}
          position="top-center"
          richColors
        />
      </Portal>
    </Fragment>
  );
}
