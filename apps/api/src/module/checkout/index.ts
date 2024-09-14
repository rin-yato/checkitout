import { OpenAPIHono } from "@hono/zod-openapi";
import { createCheckout } from "./route/create";
import { checkoutPortal } from "./route/portal";
import { publicCreateCheckout } from "./route/public-create";

export const CheckoutRoute = new OpenAPIHono()
  .route("/", createCheckout)
  .route("/", publicCreateCheckout)
  .route("/", checkoutPortal);
