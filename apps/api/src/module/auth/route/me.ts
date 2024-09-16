import { validateAuth } from "@/lib/auth";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

export const me = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "get",
    path: "/auth/me",
    tags: ["Auth"],
    description: "Get the current user",
    responses: {
      200: {
        description: "The current user",
      },
    },
  }),
  async (c) => {
    const { user } = validateAuth(c);
    return c.json(user);
  },
);
