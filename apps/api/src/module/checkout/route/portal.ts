import { checkoutService } from "@/service/checkout.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const checkoutPortal = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "get",
    path: "/checkout/portal/{checkoutId}",
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
      throw checkout.error;
    }

    if (!checkout.value) throw new Error("Checkout not found");

    return c.json({ data: checkout.value });
  },
);
