import { OpenAPIHono } from "@hono/zod-openapi";
import { googleAuth } from "./route/auth.google";
import { googleAuthCallback } from "./route/auth.google-callback";
import { me } from "./route/me";

export const AuthRoute = new OpenAPIHono()
  .route("/", googleAuth)
  .route("/", googleAuthCallback)
  .route("/", me);
