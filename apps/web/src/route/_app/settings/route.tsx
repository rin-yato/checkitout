import { Flex, Heading, TabNav, Text } from "@radix-ui/themes";
import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const match = useMatchRoute();

  const matchRoute = (pathname: string) => Boolean(match({ to: pathname }));

  return (
    <main className="flex flex-1 flex-col gap-y-5 px-10 py-5">
      <nav className="space-y-5">
        <Heading trim="normal">Settings</Heading>

        <TabNav.Root className="gap-x-5 pt-2.5">
          <TabNav.Link asChild active={matchRoute("/settings")}>
            <Link to="/settings" activeOptions={{ exact: true }}>
              <Text size="3">General Settings</Text>
            </Link>
          </TabNav.Link>
          <TabNav.Link asChild active={matchRoute("/settings/account")}>
            <Link to="/settings/account">
              <Text size="3">Account</Text>
            </Link>
          </TabNav.Link>
          <TabNav.Link asChild active={matchRoute("/settings/api")}>
            <Link to="/settings/api">
              <Text size="3">API Token</Text>
            </Link>
          </TabNav.Link>
        </TabNav.Root>
      </nav>

      <Flex className="flex-1 pt-6">
        <Outlet />
      </Flex>
    </main>
  );
}
