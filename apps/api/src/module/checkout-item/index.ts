import { OpenAPIHono } from "@hono/zod-openapi";
import { createCheckoutItem } from "./route/create";

export const CheckoutItemRoute = new OpenAPIHono().route("/", createCheckoutItem);
