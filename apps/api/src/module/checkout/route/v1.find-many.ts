import { validateAuth } from "@/lib/auth";
import { apiError } from "@/lib/error";
import { paginationSchema } from "@/lib/pagination";
import { checkoutService } from "@/service/checkout.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { findManyCheckoutV1Response } from "@repo/schema";
import { endTime, startTime } from "hono/timing";

export const findManyCheckoutV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "get",
    path: "/v1/checkout",
    operationId: "Find Many Checkout",
    tags: ["Checkout"],
    request: {
      query: paginationSchema,
    },
    responses: {
      200: {
        description: "Find many checkouts",
        content: {
          "application/json": {
            schema: findManyCheckoutV1Response.openapi("Find Many Checkout V1"),
          },
        },
      },
    },
  }),
  async (c) => {
    const { user } = validateAuth(c);
    const { perPage, page } = c.req.valid("query");

    startTime(c, "findManyCheckoutV1");
    const rawCheckouts = await checkoutService.findMany(user.id, { page, perPage });
    endTime(c, "findManyCheckoutV1");

    if (rawCheckouts.error) {
      throw apiError({
        status: 500,
        message: "Failed to find many checkouts",
        details: rawCheckouts.error.message,
      });
    }

    const response = findManyCheckoutV1Response.safeParse(rawCheckouts.value);

    if (response.error) {
      throw apiError({
        status: 500,
        message: "Failed to find many checkouts",
        details: response.error.message,
      });
    }

    return c.json(response.data);
  },
);
