import "./global.css";
import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";

import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClientProvider, queryClient } from "@/provider/query-client.provider";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./route.gen";

import { DefaultCatchBoundary } from "@/component/default-catch-boundary";
import { COLOR } from "@/constant/theme";
import { Theme, ThemePanel } from "@radix-ui/themes";
import { AuthProvider, useInternalAuth } from "./provider/auth.provider";

const router = createRouter({
  routeTree,
  defaultPendingMs: 200,
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => <div>Loading...</div>,
  defaultErrorComponent: (props) => <DefaultCatchBoundary {...props} />,

  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const auth = useInternalAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

const rootElement = document.getElementById("root");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider>
        <Theme
          scaling="95%"
          radius="medium"
          grayColor={COLOR.GRAY}
          accentColor={COLOR.PRIMARY}
          className="flex h-dvh antialiased"
        >
          <AuthProvider>
            <App />
          </AuthProvider>
          <ThemePanel defaultOpen={false} />
        </Theme>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
