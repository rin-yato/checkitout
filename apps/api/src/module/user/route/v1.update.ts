import { validateAuth } from "@/lib/auth";
import { userService } from "@/service/user.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { userUpdateSchema } from "@repo/db/schema";

export const updateUserV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "patch",
    path: "/v1/user",
    description: "Update user information",
    tags: ["User"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: userUpdateSchema.openapi("User Update"),
          },
        },
      },
    },
    responses: {
      200: {
        description: "User information updated",
      },
    },
  }),
  async (c) => {
    const { user } = validateAuth(c);
    const body = c.req.valid("json");

    const updatedUser = await userService.update(user.id, body);

    if (updatedUser.error) {
      return c.json(updatedUser.error, 500);
    }

    return c.json(updatedUser.value);
  },
);
