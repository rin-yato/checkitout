import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/support")({
  component: () => <div>Hello /_app/support!</div>,
});
