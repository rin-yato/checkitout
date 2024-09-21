import { ApiError } from "@/lib/error";
import type { App } from "./context";
import { HTTPException } from "hono/http-exception";
import { logger } from "./logger";
import { scoped } from "@repo/libs";
import { maskSensitiveHeaders } from "@/lib/mask";

export function registerGlobalErrorHandler(app: App) {
  app.onError(async (err, c) => {
    const path = c.req.path;
    const query = c.req.query();
    const method = c.req.method;
    const status = c.res.status;
    const reqHeader = maskSensitiveHeaders(c.req.header());
    const resHeader = maskSensitiveHeaders(Object.fromEntries(c.res.headers));

    const body = await scoped(async () => {
      if (c.req.header("Content-Type") === "application/json") {
        return await c.req.json().catch(() => ({ message: "Invalid JSON" }));
      }
    });

    const errorInfo = {
      status,
      method,
      query,
      path,
      "res-header": resHeader,
      "req-header": reqHeader,
      body,
      error: err,
    };

    logger.error(errorInfo);

    if (err instanceof ApiError) {
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
