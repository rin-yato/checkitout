import type { HomeLayoutProps } from "fumadocs-ui/home-layout";

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: HomeLayoutProps = {
  nav: {
    title: "Checkitout",
  },
  links: [
    {
      text: "Checkitout",
      url: "https://checkitout.rinyato.com",
    },
    {
      text: "Checkitout API",
      url: "https://api-checkitout.rinyato.com",
    },
    {
      text: "Author",
      url: "https://rinyato.com",
    },
  ],
};
