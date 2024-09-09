import { logger } from "hono/logger";
import { OpenAPIHono } from "@hono/zod-openapi";

import { AuthRoute } from "./auth";
import { UserRoute } from "./user";
import { TransactionRoute } from "./transaction";
import { CheckoutItemRoute } from "./checkout-item";
import { CheckoutRoute } from "./checkout";

export const Modules = new OpenAPIHono()
  .use(logger())
  .route("/", AuthRoute)
  .route("/", UserRoute)
  .route("/", TransactionRoute)
  .route("/", CheckoutItemRoute)
  .route("/", CheckoutRoute);
