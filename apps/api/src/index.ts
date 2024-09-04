import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { registerTasker } from "./lib/tasker";
import { Route } from "./route";

import { cors } from "hono/cors";
// Tasker
import { TransactionTasker } from "./route/transaction/tasker";

const app = new OpenAPIHono();

// The OpenAPI documentation will be available at /doc
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

registerTasker(app, [new TransactionTasker()]);

app.use(
  "*",
  cors({ origin: "*", allowHeaders: ["Content-Type"], allowMethods: ["GET", "POST"] }),
);

app.route("/", Route);

export default app;
