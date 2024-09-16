import type { App } from "./context";
import { cors } from "hono/cors";

export function registerCors(app: App) {
  app.use("*", cors({ origin: ["http://localhost:3000"], credentials: true }));
}
