import { apiError } from "@/lib/error";
import { checkoutService } from "@/service/checkout.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const checkoutPortalV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "get",
    path: "/v1/checkout/portal/{checkoutId}",
    tags: ["Checkout"],
    request: {
      params: z.object({ checkoutId: z.string() }),
    },
    responses: {
      200: { description: "Checkout portal" },
    },
  }),
  async (c) => {
    const checkoutId = c.req.param("checkoutId");

    const checkout = await checkoutService.portal(checkoutId);

    if (checkout.error) {
      throw apiError({
        status: 500,
        message: "Failed to get checkout",
        details: checkout.error.message,
      });
    }

    if (!checkout.value)
      throw apiError({
        status: 404,
        message: "Checkout not found",
      });

    return c.json({ data: checkout.value });
  },
);
