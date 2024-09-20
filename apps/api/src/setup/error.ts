import { ApiError } from "@/lib/error";
import type { App } from "./context";
import { HTTPException } from "hono/http-exception";
import { logger } from "./logger";
import { scoped } from "@repo/libs";

export function registerGlobalErrorHandler(app: App) {
  app.onError(async (err, c) => {
    const body = await scoped(async () => {
      if (c.req.header("Content-Type") === "application/json") {
        return await c.req.json().catch(() => ({ message: "Invalid JSON" }));
      }
    });

    if (err instanceof ApiError) {
      const { status, message, details, name } = err;

      logger.error({
        stack: err.stack,
        status,
        message,
        details,
        body,
        name,
        type: "Error",
      });

      return c.json({ message, details, name, status }, status);
    }

    if (err instanceof HTTPException) {
      const res = err.getResponse();

      logger.error({
        body,
        stack: err.stack,
        status: res.status,
        message: err.message,
        name: "HTTP_EXCEPTION",
        type: "Error",
      });

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

    logger.error({
      stack: err.stack,
      body,
      status: 500,
      message: err.message,
      name: "UNKNOWN",
      type: "Error",
    });

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
