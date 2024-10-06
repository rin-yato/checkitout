import { Sidebar } from "@/component/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  beforeLoad: ({ context }) => {
    if (context.auth._tag === "UNAUTHENTICATED") {
      throw redirect({ to: "/login" });
    }
  },
});

export function AppLayout() {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <Outlet />
    </div>
  );
}
