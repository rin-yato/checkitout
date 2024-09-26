import { validateAuth } from "@/lib/auth";
import { db, takeFirst } from "@/lib/db";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { err, ok } from "@justmiracle/result";
import { TB_fileUpload } from "@repo/db/table";
import { scoped } from "@repo/libs";
import { and, eq } from "drizzle-orm";
import { authMeResponse } from "@repo/schema";
import { apiError } from "@/lib/error";

export const me = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "get",
    path: "/auth/me",
    tags: ["Auth"],
    description: "Get the current user",
    responses: {
      200: {
        description: "The current user",
        content: {
          "application/json": { schema: authMeResponse },
        },
      },
    },
  }),
  async (c) => {
    const { user } = validateAuth(c);

    const profile = await scoped(async () => {
      if (!user.profile) return null;

      const maybeProfile = await db
        .select()
        .from(TB_fileUpload)
        .where(
          and(eq(TB_fileUpload.userId, user.id), eq(TB_fileUpload.url, user.profile ?? "")),
        )
        .execute()
        .then(takeFirst)
        .then(ok)
        .catch(err);

      if (maybeProfile.error || !maybeProfile.value) return null;

      return maybeProfile.value;
    });

    const response = authMeResponse.safeParse({ ...user, profile });

    if (!response.success) {
      throw apiError({
        status: 500,
        message: "Failed to parse response",
        details: response.error,
      });
    }

    return c.json(response.data);
  },
);
