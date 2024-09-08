import { OpenAPIHono } from "@hono/zod-openapi";
import { googleAuth } from "./route/auth.google";
import { googleAuthCallback } from "./route/auth.google-callback";

export const AuthRoute = new OpenAPIHono()
  .route("/", googleAuth)
  .route("/", googleAuthCallback);
