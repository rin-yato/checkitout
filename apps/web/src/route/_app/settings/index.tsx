import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings/")({
  component: GeneralSettingsPage,
});

function GeneralSettingsPage() {
  return <div>general setting</div>;
}
