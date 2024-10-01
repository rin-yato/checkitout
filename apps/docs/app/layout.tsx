import { cn } from "@/lib/utils";
import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Checkitout Docs",
  description: "Payment service by developer for developers",
  icons: "/logo.png",
  authors: { name: "RinYato", url: "https://rinyato.com" },
  creator: "JustMiracle | RinYato",
  keywords: [
    "Checkitout",
    "Payment",
    "Service",
    "Developer",
    "API",
    "Dashboard",
    "Docs",
    "Documentation",
    "JustMiracle",
  ],
  openGraph: {
    title: "Checkitout Docs",
    description: "Payment service by developer for developers",
    authors: ["https://rinyato.com", "RinYato"],
    images: [
      {
        url: "/og.png",
        alt: "Checkitout",
        type: "image/png",
      },
    ],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(inter.className, "antialiased")} suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
