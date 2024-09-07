import "./global.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClientProvider, queryClient } from "@/provider/query-client.provider";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./route.gen";

import { DefaultCatchBoundary } from "@/component/default-catch-boundary";
import { COLOR } from "@/constant/theme";
import { Theme, ThemePanel } from "@radix-ui/themes";

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
  return <RouterProvider router={router} />;
}

const rootElement = document.getElementById("root");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider>
        <Theme
          radius="medium"
          grayColor={COLOR.GRAY}
          accentColor={COLOR.PRIMARY}
          panelBackground="translucent"
          className="antialiased"
        >
          <App />
          <ThemePanel defaultOpen={false} />
        </Theme>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
