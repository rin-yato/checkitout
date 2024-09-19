import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/transactions")({
  component: () => <div>Hello /_app/transactions!</div>,
});
