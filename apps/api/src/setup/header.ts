import { csrf } from "hono/csrf";
import type { App } from "./context";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";

export function registerHeaderMiddleware(app: App) {
  app.use(csrf(), requestId(), secureHeaders());
}
