import { validateAuth } from "@/lib/auth";
import { response } from "@/lib/route";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { checkoutItemInsert, checkoutItemSchema } from "@repo/db/schema";

export const createCheckoutItem = new OpenAPIHono().openapi(
  createRoute({
    method: "post",
    path: "/checkout-item",
    description: "Create a checkout item",
    request: {
      body: {
        content: {
          "application/json": {
            schema: checkoutItemInsert.openapi("CheckoutItem"),
          },
        },
      },
    },
    responses: {
      200: response({
        description: "Checkout item created",
        schema: checkoutItemSchema,
      }),
    },
  }),
  async (c) => {
    const {} = validateAuth(c);
    return c.json({ id: "123" });
  },
);
