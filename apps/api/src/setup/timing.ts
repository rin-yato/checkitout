import { env } from "@/lib/env";
import { timing } from "hono/timing";
import type { App } from "./context";

export function registerTiming(app: App) {
  app.use(
    "*",
    timing({
      enabled: env.NODE_ENV !== "production",
    }),
  );
}
