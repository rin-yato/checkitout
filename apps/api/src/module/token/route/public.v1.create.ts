import { validateAuth } from "@/lib/auth";
import { tokenService } from "@/service/token.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const createTokenV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    tags: ["Token"],
    method: "post",
    path: "/v1/token",
    description: "Create a token",
    responses: {
      200: {
        description: "Token created",
        content: {
          "application/json": {
            schema: z.object({ token: z.string() }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { user } = validateAuth(c);

    const token = await tokenService.create(user.id);

    if (token.error) {
      throw token.error;
    }

    return c.json({ token: token.value.token });
  },
);
