import { env } from "@/lib/env";

import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import type { User } from "@repo/db/schema";
import { TB_session, TB_user } from "@repo/db/table";
import { Lucia } from "lucia";
import { db } from "../db";

export const adapter = new DrizzleSQLiteAdapter(db, TB_session, TB_user);

export const SESSION_COOKIE_NAME = "auth" as const;

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: SESSION_COOKIE_NAME,
    attributes: {
      path: "/",
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      domain: env.BASE_URL,
    },
  } as const,

  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      googleId: attributes.googleId,
      username: attributes.username,
      displayName: attributes.displayName,
      profile: attributes.profile,
      email: attributes.email,
      createdAt: attributes.createdAt,
      updatedAt: attributes.createdAt,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
