import type { AppEnv } from "@/setup/context";
import { endTime, startTime } from "hono/timing";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { checkoutService } from "@/service/checkout.service";
import { validateToken } from "@/setup/token.middleware";
import { userService } from "@/service/user.service";
import { apiError } from "@/lib/error";
import { checkoutCreateV1Body, checkoutCreateV1Response } from "@repo/schema";

export const createCheckoutV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "post",
    path: "/v1/checkout",
    tags: ["Checkout"],
    description: "Create a checkout",
    operationId: "Create Checkout",
    request: {
      body: {
        content: {
          "application/json": {
            schema: checkoutCreateV1Body.openapi("Checkout Create V1 Body"),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Checkout created",
        content: {
          "application/json": {
            schema: checkoutCreateV1Response.openapi("Checkout Create V1 Response"),
          },
        },
      },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");

    startTime(c, "token validation");
    const token = await validateToken(c);
    const user = await userService.findById(token.userId);
    if (user.error || !user.value) {
      throw apiError({
        status: 401,
        message: "Unauthorized",
        details: user.error,
      });
    }
    endTime(c, "token validation");

    startTime(c, "db");
    const checkout = await checkoutService.create(user.value, body);
    endTime(c, "db");

    if (checkout.error) {
      throw apiError({
        status: 400,
        message: "Failed to create checkout",
        details: checkout.error.message,
      });
    }

    return c.json(checkout.value);
  },
);
