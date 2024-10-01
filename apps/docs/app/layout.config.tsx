import type { HomeLayoutProps } from "fumadocs-ui/home-layout";
import { AppWindowMac, CodeXml, UserCircle } from "lucide-react";

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: HomeLayoutProps = {
  nav: {
    title: <span className="font-serif italic text-2xl font-medium">Checkitout</span>,
    enabled: false,
  },
  links: [
    {
      icon: <CodeXml />,
      text: "API",
      url: "https://api-checkitout.rinyato.com",
    },
    {
      icon: <AppWindowMac />,
      text: "Dashboard",
      url: "https://checkitout.rinyato.com",
    },
    {
      icon: <UserCircle />,
      text: "Author",
      url: "https://rinyato.com",
    },
  ],
};
