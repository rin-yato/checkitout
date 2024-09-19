import { isApiError } from "@/lib/error";
import type { App } from "./context";
import { HTTPException } from "hono/http-exception";

export function registerGlobalErrorHandler(app: App) {
  app.onError((err, c) => {
    if (isApiError(err)) {
      const { status, message, details, name } = err;
      return c.json({ message, details, name, status }, status);
    }

    if (err instanceof HTTPException) {
      const res = err.getResponse();
      return new Response(
        JSON.stringify({
          name: "HTTP_EXCEPTION",
          status: res.status,
          message: err.message,
        }),
        {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        },
      );
    }

    return c.json({ status: 500, message: err.message, name: "UNKNOWN" }, 500);
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
