import { OpenAPIHono, z } from "@hono/zod-openapi";
import { createRoute, response } from "../../lib/route";

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
    return c.json({ users: ["henlo"] });
  },
);

export const UserRoute = new OpenAPIHono().route("/", GetUsers);
