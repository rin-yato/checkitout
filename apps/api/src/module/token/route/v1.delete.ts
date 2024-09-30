import { validateAuth } from "@/lib/auth";
import { apiError } from "@/lib/error";
import { tokenService } from "@/service/token.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const deleteTokenV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "delete",
    path: "/v1/token/{tokenName}",
    operationId: "Delete Token",
    description: "Delete a token",
    tags: ["Token"],
    request: {
      params: z.object({ tokenName: z.string() }),
    },
    responses: {
      204: {
        description: "Token deleted",
      },
      404: {
        description: "Token not found",
      },
    },
  }),
  async (c) => {
    const { user } = validateAuth(c);
    const { tokenName } = c.req.valid("param");

    const deleted = await tokenService.delete(tokenName, user.id);

    if (deleted.error) {
      throw apiError({
        status: 404,
        message: "Token not found",
      });
    }

    return c.json(deleted.value, 204);
  },
);
