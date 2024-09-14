import { OpenAPIHono } from "@hono/zod-openapi";
import { createTokenV1 } from "./route/public.v1.create";
import { findOneTokenV1 } from "./route/public.v1.find-one";

export const TokenRoute = new OpenAPIHono()
  .route("/", createTokenV1)
  .route("/", findOneTokenV1);
