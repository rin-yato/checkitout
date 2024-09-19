import { isApiError } from "@/lib/error";
import type { App } from "./context";

export function registerGlobalErrorHandler(app: App) {
  app.onError((err, c) => {
    if (isApiError(err)) {
      const { status, message, details, name } = err;
      return c.json({ message, details, name, status }, status);
    }

    return c.json({ status: 500, message: err.message, name: "UNKNOWN_ERROR" }, 500);
  });

  app.notFound((c) => {
    return c.json(
      {
        status: 404,
        message: "Not found :(",
        name: "NOT_FOUND",
      },
      404,
    );
  });
}
