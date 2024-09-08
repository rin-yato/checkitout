import type { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";

export function registerCors(app: OpenAPIHono) {
  app.use("*", cors({ origin: "*" }));
}
