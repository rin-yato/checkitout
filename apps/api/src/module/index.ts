import { logger } from "hono/logger";
import { OpenAPIHono } from "@hono/zod-openapi";

import { AuthRoute } from "./auth";
import { UserRoute } from "./user";
import { TransactionRoute } from "./transaction";
import { CheckoutRoute } from "./checkout";
import { TokenRoute } from "./token";

export const Modules = new OpenAPIHono()
  .use(logger())
  .route("/", AuthRoute)
  .route("/", UserRoute)
  .route("/", TransactionRoute)
  .route("/", CheckoutRoute)
  .route("/", TokenRoute);
