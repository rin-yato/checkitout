import { validateAuth } from "@/lib/auth";
import { tokenService } from "@/service/token.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const deleteTokenV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "delete",
    path: "/v1/token/{tokenName}",
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

    if (deleted.error) throw deleted.error;

    return c.json(deleted.value, 204);
  },
);
