import { checkoutRequestSchema, checkoutService } from "@/service/checkout.service";
import { userService } from "@/service/user.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { endTime, startTime } from "hono/timing";

export const publicCreateCheckout = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "post",
    path: "/v1/checkout",
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
            schema: z.any(),
          },
        },
      },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");
    const userId = c.req.header("X-User-Id");

    if (!userId) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const user = await userService.findById(userId);

    if (user.error || !user.value) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    startTime(c, "db");
    const checkout = await checkoutService.create(user.value, body);
    endTime(c, "db");

    if (checkout.error) {
      throw checkout.error;
    }

    const { checkout: ch, items, transaction } = checkout.value;

    return c.json({ ...ch, items, transaction });
  },
);
