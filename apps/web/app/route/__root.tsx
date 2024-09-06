// @ts-expect-error
import GlobalCSS from "../global.css?url";

import { Theme, ThemePanel } from "@radix-ui/themes";

import { DefaultCatchBoundary } from "@/component/default-catch-boundary";
import { NotFound } from "@/component/not-found";
import { COLOR } from "@/constant/theme";
import { createRootRoute } from "@tanstack/react-router";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";

export const Route = createRootRoute({
  meta: () => [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { title: "Miracle Pay" },
  ],
  links: () => [{ rel: "stylesheet", href: GlobalCSS }],
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
});

function RootComponent() {
  return (
    <RootDocument>
      <Theme accentColor={COLOR.PRIMARY} grayColor={COLOR.GRAY}>
        <Outlet />
        <ThemePanel defaultOpen={false} />
      </Theme>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
