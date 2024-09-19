import { OpenAPIHono } from "@hono/zod-openapi";
import { createCheckoutV1 } from "./route/v1.create";
import { checkoutPortal } from "./route/portal";

export const CheckoutRoute = new OpenAPIHono()
  .route("/", createCheckoutV1)
  .route("/", checkoutPortal);
