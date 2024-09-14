import { validateAuth } from "@/lib/auth";
import type { AppEnv } from "@/setup/context";
import { endTime, startTime } from "hono/timing";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { checkoutRequestSchema, checkoutService } from "@/service/checkout.service";

export const createCheckout = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "post",
    path: "/checkout",
    tags: ["Checkout"],
    description: "Create a checkout",
    request: {
      body: {
        content: {
          "application/json": {
            schema: checkoutRequestSchema.openapi("Checkout Insert"),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Checkout created",
        content: {
          "application/json": {
            schema: z.object({ data: z.any() }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { user } = validateAuth(c);
    const body = c.req.valid("json");

    startTime(c, "db");
    const checkout = await checkoutService.create(user, body);
    endTime(c, "db");

    if (checkout.error) {
      throw checkout.error;
    }

    return c.json({ data: checkout.value });
  },
);
