import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/appearance")({
  component: () => <div>Hello /_app/appearance!</div>,
});
