import type { AppContext } from "@/setup/context";
import type { Session, User } from "lucia";
import { apiError } from "./error";

export function validateAuth(c: AppContext): { user: User; session: Session } {
  if (!c.var.user || !c.var.session) {
    throw apiError({
      status: 401,
      message: "Unauthorized",
      details: "User or session not found",
    });
  }

  return { user: c.var.user, session: c.var.session };
}
