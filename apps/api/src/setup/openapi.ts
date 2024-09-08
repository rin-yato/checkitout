import type { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";

export function registerOpenAPI(app: OpenAPIHono) {
  app.doc31("/openapi", {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "My API",
    },
  });

  app.get(
    "/docs",
    apiReference({
      theme: "purple",
      spec: {
        url: "/openapi",
      },
    }),
  );
}
