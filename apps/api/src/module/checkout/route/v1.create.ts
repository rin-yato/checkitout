import type { AppEnv } from "@/setup/context";
import { endTime, startTime } from "hono/timing";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { checkoutRequestSchema, checkoutService } from "@/service/checkout.service";
import { validateToken } from "@/setup/token.middleware";
import { userService } from "@/service/user.service";
import { HTTPException } from "hono/http-exception";

export const createCheckoutV1 = new OpenAPIHono<AppEnv>().openapi(
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

    startTime(c, "token validation");
    const token = await validateToken(c);
    const user = await userService.findById(token.userId);
    if (user.error || !user.value) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    endTime(c, "token validation");

    startTime(c, "db");
    const checkout = await checkoutService.create(user.value, body);
    endTime(c, "db");

    if (checkout.error) {
      throw checkout.error;
    }

    return c.json(checkout.value);
  },
);
