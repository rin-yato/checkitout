import { validateAuth } from "@/lib/auth";
import { apiError } from "@/lib/error";
import { tokenService } from "@/service/token.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const createTokenV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    tags: ["Token"],
    method: "post",
    path: "/v1/token",
    description: "Create a token",
    operationId: "Create Token",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({ name: z.string() }),
          },
        },
      },
    },
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
    const { name } = c.req.valid("json");

    if (!name) {
      throw apiError({
        status: 400,
        message: "Token name is required",
      });
    }

    const token = await tokenService.create(user.id, name);

    if (token.error) {
      throw apiError({
        status: 400,
        message: "Failed to create token",
        details: token.error.message,
      });
    }

    return c.json(token.value);
  },
);
