import { apiError } from "@/lib/error";
import { tokenService } from "@/service/token.service";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { endTime, startTime } from "hono/timing";

export const findOneTokenV1 = new OpenAPIHono().openapi(
  createRoute({
    method: "get",
    path: "/v1/token/{token}",
    tags: ["Token"],
    description: "Find one token",
    request: {
      params: z.object({
        token: z.string({ required_error: "Missing token ID" }).min(16, "Invalid token ID"),
      }),
    },
    responses: {
      200: {
        description: "Token found",
        content: {
          "application/json": {
            schema: z.object({ token: z.string() }).strict("remove"),
          },
        },
      },
    },
  }),
  async (c) => {
    const param = c.req.valid("param");

    startTime(c, "redis");
    const token = await tokenService.findOne(param.token);
    endTime(c, "redis");

    if (token.error) {
      throw apiError({
        status: 500,
        message: "Unable to query token",
        details: "Could not query token from database",
      });
    }

    if (!token.value) {
      throw apiError({
        status: 404,
        message: "Token not found",
        details: "Token does not exist in database",
      });
    }

    return c.json(token.value);
  },
);
