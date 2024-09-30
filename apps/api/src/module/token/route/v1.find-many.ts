import { validateAuth } from "@/lib/auth";
import { tokenService } from "@/service/token.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

export const findManyTokenV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "get",
    path: "/v1/token",
    tags: ["Token"],
    description: "Find many tokens",
    operationId: "Find Many Tokens",
    responses: {
      200: {
        description: "Find many tokens",
      },
    },
  }),
  async (c) => {
    const { user } = validateAuth(c);
    const tokens = await tokenService.findMany(user.id);
    if (tokens.error) return c.json(tokens.error.message, 400);
    return c.json(tokens.value);
  },
);
