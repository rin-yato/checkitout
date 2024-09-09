import { OpenAPIHono } from "@hono/zod-openapi";
import { createCheckout } from "./route/create";

export const CheckoutRoute = new OpenAPIHono().route("/", createCheckout);
