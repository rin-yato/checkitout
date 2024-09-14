import type { AppContext } from "@/setup/context";
import type { Session, User } from "lucia";

export function validateAuth(c: AppContext): { user: User; session: Session } {
  if (!c.var.user || !c.var.session) {
    throw new Error("Unauthorized");
  }

  return { user: c.var.user, session: c.var.session };
}
