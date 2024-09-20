import { csrf } from "hono/csrf";
import type { App } from "./context";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { env } from "@/lib/env";

export function registerHeaderMiddleware(app: App) {
  app.use(requestId(), secureHeaders(), csrf({ origin: [env.WEB_URL, env.API_URL] }));
}
