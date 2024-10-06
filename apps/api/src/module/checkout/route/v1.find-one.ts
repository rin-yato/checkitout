import { apiError } from "@/lib/error";
import { checkoutService } from "@/service/checkout.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { findOneCheckoutV1Response } from "@repo/schema";

export const findOneCheckoutV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "get",
    path: "/v1/checkout/{id}",
    tags: ["Checkout"],
    description: "Find a checkout",
    operationId: "Find One Checkout",
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: {
        description: "Checkout found",
        content: { "application/json": { schema: findOneCheckoutV1Response } },
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const checkout = await checkoutService.findById(id);

    if (checkout.error) {
      throw apiError({
        status: 500,
        message: "Could not query checkout",
        details: checkout.error.message,
      });
    }

    if (!checkout.value) {
      throw apiError({
        status: 404,
        message: "Checkout not found",
        details: "Checkout not found",
      });
    }

    const parsedResponse = findOneCheckoutV1Response.safeParse(checkout.value);

    if (!parsedResponse.success) {
      throw apiError({
        status: 500,
        message: "Failed to parse checkout response",
        details: parsedResponse.error.formErrors,
      });
    }

    return c.json(checkout.value);
  },
);
