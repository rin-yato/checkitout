import type { App } from "./context";
import { cors } from "hono/cors";

export function registerCors(app: App) {
  app.use("*", cors({ origin: "*" }));
}
