import { ApiError } from "@/lib/error";
import type { App } from "./context";
import { HTTPException } from "hono/http-exception";
import { logger } from "./logger";

export function registerGlobalErrorHandler(app: App) {
  app.onError((err, c) => {
    console.error("error", { err, reqHeader: c.req.header });

    if (err instanceof ApiError) {
      const { status, message, details, name, stack, cause } = err;

      logger.error({
        header: c.req.header,
        cause,
        stack,
        status,
        message,
        details,
        name,
        type: "Error",
      });

      return c.json({ message, details, name, status }, status);
    }

    if (err instanceof HTTPException) {
      const res = err.getResponse();

      logger.error({
        stack: err.stack,
        cause: err.cause,
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
      cause: err.cause,
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
