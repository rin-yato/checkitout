import { createRoute, response } from "@/lib/route";
import { db } from "@/lib/db";
import { OpenAPIHono, z } from "@hono/zod-openapi";

const GetUsers = createRoute(
  {
    method: "get",
    path: "/users",
    responses: {
      200: response({
        description: "List of users",
        schema: z.object({ users: z.array(z.string()) }),
      }),
    },
  },
  async (c) => {
    const users = await db.query.TB_user.findMany();
    return c.json(users);
  },
);

export const UserRoute = new OpenAPIHono().route("/", GetUsers);
