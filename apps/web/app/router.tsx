import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "./component/default-catch-boundary";
import { NotFound } from "./component/not-found";
import { routeTree } from "./route.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultNotFoundComponent: () => <NotFound />,
    defaultErrorComponent: DefaultCatchBoundary,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
