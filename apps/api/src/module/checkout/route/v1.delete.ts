import { validateAuth } from "@/lib/auth";
import { apiError } from "@/lib/error";
import { checkoutService } from "@/service/checkout.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const deleteCheckoutV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "delete",
    path: "/v1/checkout/{id}",
    tags: ["Checkout"],
    description: "Delete a checkout",
    operationId: "Delete One Checkout",
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: {
        description: "Checkout deleted",
      },
    },
  }),
  async (c) => {
    const { user } = validateAuth(c);
    const { id } = c.req.valid("param");

    const deletedCheckout = await checkoutService.delete(id, user.id);

    if (deletedCheckout.error) {
      throw apiError({
        status: 500,
        message: "Could not delete checkout",
        details: deletedCheckout.error.message,
      });
    }

    return c.json(null);
  },
);
