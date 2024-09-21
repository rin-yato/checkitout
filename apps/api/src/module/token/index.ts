import { OpenAPIHono } from "@hono/zod-openapi";
import { createTokenV1 } from "./route/v1.create";
import { findOneTokenV1 } from "./route/v1.find-one";
import { findManyTokenV1 } from "./route/v1.find-many";
import { deleteTokenV1 } from "./route/v1.delete";

export const TokenRoute = new OpenAPIHono({ strict: true })
  .route("/", createTokenV1)
  .route("/", findOneTokenV1)
  .route("/", findManyTokenV1)
  .route("/", deleteTokenV1);
