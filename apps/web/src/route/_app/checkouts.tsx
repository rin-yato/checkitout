import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/checkouts")({
  component: () => <div>Hello /_app/checkouts!</div>,
});
