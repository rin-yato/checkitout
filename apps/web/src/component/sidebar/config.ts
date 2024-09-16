import {
  CirclesFour,
  Gear,
  Headset,
  Palette,
  Receipt,
  ShoppingCart,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

export const MODULES = {
  main: [
    { label: "Dashboard", icon: CirclesFour, href: "/" },
    { label: "Checkouts", icon: ShoppingCart, href: "/checkouts" },
    { label: "Transactions", icon: Receipt, href: "/transactions" },
    { label: "Appearance", icon: Palette, href: "/appearance" },
  ],
  footer: [
    { label: "Support", icon: Headset, href: "/support" },
    { label: "Settings", icon: Gear, href: "/settings" },
  ],
} as const;

export interface Module {
  label: string;
  icon: Icon;
  href: (typeof MODULES)["footer" | "main"][number]["href"];
}
