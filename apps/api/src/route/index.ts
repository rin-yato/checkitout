import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { TransactionRoute } from "./transaction";
import { UserRoute } from "./user";

export const Route = new OpenAPIHono()
  .use(logger())
  .route("/", UserRoute)
  .route("/", TransactionRoute);
