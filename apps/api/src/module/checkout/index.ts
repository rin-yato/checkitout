import { OpenAPIHono } from "@hono/zod-openapi";
import { createCheckoutV1 } from "./route/v1.create";
import { checkoutPortalV1 } from "./route/v1.portal";
import { findOneCheckoutV1 } from "./route/v1.find-one";
import { findManyCheckoutV1 } from "./route/v1.find-many";
import { deleteCheckoutV1 } from "./route/v1.delete";
import { checkoutRetryWebhookV1 } from "./route/v1.retry-webhook";

export const CheckoutRoute = new OpenAPIHono()
  .route("/", createCheckoutV1)
  .route("/", checkoutPortalV1)
  .route("/", findOneCheckoutV1)
  .route("/", findManyCheckoutV1)
  .route("/", deleteCheckoutV1)
  .route("/", checkoutRetryWebhookV1);
