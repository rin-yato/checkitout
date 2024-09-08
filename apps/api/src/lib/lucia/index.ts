import { env } from "@lib/env";

import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import { createDBClient } from "@repo/db";
import { Lucia } from "lucia";

const squealite = createDBClient({
  url: env.DB_URL,
  authToken: env.DB_TOKEN,
});

export const adapter = new LibSQLAdapter(squealite, {
  user: "user",
  session: "session",
});

export const SESSION_COOKIE_NAME = "auth" as const;

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: SESSION_COOKIE_NAME,
    attributes: {
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: env.NEXT_PUBLIC_BASE_DOMAIN,
    },
  } as const,

  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      githubId: attributes.github_id,
      googleId: attributes.google_id,
      username: attributes.username,
      displayName: attributes.display_name,
      profile: attributes.profile,
      email: attributes.email,
      createdAt: attributes.created_at,
      updatedAt: attributes.updated_at,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  display_name: string;
  profile: string | null;
  email: string;
  github_id: string | null;
  google_id: string | null;
  created_at: Date;
  updated_at: Date;
}
