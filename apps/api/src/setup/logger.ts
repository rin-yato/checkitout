import pino from "pino";
import type { App } from "./context";
import { env } from "@/lib/env";
import { maskSensitiveHeaders } from "@/lib/mask";

const axiomTransport = pino.transport({
  target: "@axiomhq/pino",
  options: {
    dataset: env.AXIOM_DATASET,
    token: env.AXIOM_TOKEN,
  },
});

const pinoPrettyTransport = pino.transport({
  target: "pino-pretty",
});

const pinoTransport = env.NODE_ENV === "production" ? axiomTransport : pinoPrettyTransport;

export const logger = pino({ level: "info" }, pinoTransport);

export function registerLogger(app: App) {
  app.use(async (c, next) => {
    const startTime = performance.now();
    await next();
    const endTime = performance.now();

    const query = c.req.query();
    const status = c.res.status;
    const reqHeader = maskSensitiveHeaders(c.req.header());
    const resHeader = maskSensitiveHeaders(Object.fromEntries(c.res.headers));

    const duration = Math.round(endTime - startTime) * 1000_000;

    // const body = await scoped(async () => {
    //   if (c.req.header("Content-Type") === "application/json") {
    //     return await c.req.json().catch(() => "Invalid JSON");
    //   }

    //   return undefined;
    // });

    const resOut = {
      status,
      method: c.req.method,
      path: c.req.path,
      query,
      duration,
      "res-header": resHeader,
      "req-header": reqHeader,
      // body,
    };

    logger.info(resOut);
  });
}
