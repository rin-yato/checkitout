import { OpenAPIHono } from "@hono/zod-openapi";
import { createCheckoutV1 } from "./route/v1.create";
import { checkoutPortalV1 } from "./route/v1.portal";

export const CheckoutRoute = new OpenAPIHono()
  .route("/", createCheckoutV1)
  .route("/", checkoutPortalV1);
