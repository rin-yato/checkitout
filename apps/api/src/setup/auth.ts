import { lucia, SESSION_COOKIE_NAME } from "@/lib/lucia";
import { getCookie } from "hono/cookie";
import { endTime, startTime } from "hono/timing";
import type { Session, User } from "lucia";
import type { App } from "./context";
import { err, ok } from "@justmiracle/result";

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
    const session = await lucia.validateSession(sessionId).then(ok).catch(err);
    endTime(c, "validate-session");

    if (session.error) {
      c.set("user", null);
      c.set("session", null);

      c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
        append: true,
      });

      endTime(c, METRIC_NAME);
      return next();
    }

    if (session.value.session?.fresh) {
      // use `header()` instead of `setCookie()` to avoid TS errors
      c.header("Set-Cookie", lucia.createSessionCookie(session.value.session.id).serialize(), {
        append: true,
      });
    }

    if (!session) {
      c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
        append: true,
      });
    }

    c.set("user", session.value.user);
    c.set("session", session.value.session);

    endTime(c, METRIC_NAME);

    return next();
  });
}
