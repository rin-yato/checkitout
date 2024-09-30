import { apiError } from "@/lib/error";
import { checkoutService } from "@/service/checkout.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

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
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const checkout = await checkoutService.findById(id);

    if (checkout.error) {
      throw apiError({
        status: 404,
        message: "Checkout not found",
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

    return c.json(checkout.value);
  },
);
