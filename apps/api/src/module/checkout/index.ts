import { OpenAPIHono } from "@hono/zod-openapi";
import { createCheckout } from "./route/create";
import { checkoutPortal } from "./route/portal";

export const CheckoutRoute = new OpenAPIHono()
  .route("/", createCheckout)
  .route("/", checkoutPortal);
