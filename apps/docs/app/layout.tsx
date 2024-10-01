import { cn } from "@/lib/utils";
import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Banner } from "fumadocs-ui/components/banner";
import { Info } from "lucide-react";

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
        <Banner variant="rainbow" changeLayout={false} id="early-stage-warning" className="">
          <Info size={18} className="mr-2" />
          Checkitout is still in early development, API are prone to change. Please report any
          issues you find.
        </Banner>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
