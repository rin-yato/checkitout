import { lucia, SESSION_COOKIE_NAME } from "@/lib/lucia";
import { getCookie } from "hono/cookie";
import { endTime, setMetric, startTime } from "hono/timing";
import type { Session, User } from "lucia";
import type { App } from "./context";

export interface Auth {
  user: User | null;
  session: Session | null;
}

const METRIC_NAME = "auth";

export function registerAuthMiddleware(app: App) {
  app.use("*", async (c, next) => {
    startTime(c, METRIC_NAME);

    const sessionId = getCookie(c, SESSION_COOKIE_NAME);

    if (!sessionId) {
      c.set("user", null);
      c.set("session", null);

      endTime(c, METRIC_NAME);

      return next();
    }

    startTime(c, "validate-session");
    const { session, user } = await lucia.validateSession(sessionId);
    endTime(c, "validate-session");

    if (session?.fresh) {
      // use `header()` instead of `setCookie()` to avoid TS errors
      c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
        append: true,
      });
    }

    if (!session) {
      c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
        append: true,
      });
    }

    c.set("user", user);
    c.set("session", session);

    endTime(c, METRIC_NAME);

    return next();
  });
}
