import { userService } from "@/service/user.service";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

export const findManyUserV1 = new OpenAPIHono().openapi(
  createRoute({
    method: "get",
    path: "/v1/user",
    description: "Find many users",
    tags: ["User"],
    responses: {
      200: {
        description: "List of users",
      },
    },
  }),
  async (c) => {
    const users = await userService.findMany();

    if (users.error) {
      return c.json(users.error, 500);
    }

    return c.json(users.value);
  },
);
