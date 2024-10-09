import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import type { PropsWithChildren } from "react";

export const queryClient = new QueryClient();

const persister = createSyncStoragePersister({ storage: window.localStorage });

export function QueryClientProvider({ children }: PropsWithChildren) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            return query.meta?.persist === true;
          },
        },
      }}
    >
      {children}
      <ReactQueryDevtools buttonPosition="top-right" />
    </PersistQueryClientProvider>
  );
}
