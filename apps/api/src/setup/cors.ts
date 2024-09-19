import { env } from "@/lib/env";
import type { App } from "./context";
import { cors } from "hono/cors";

export function registerCors(app: App) {
  app.use("*", cors({ origin: [env.WEB_URL], credentials: true }));
}
