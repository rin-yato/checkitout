import pino from "pino";
import type { App } from "./context";
import { env } from "@/lib/env";

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

function maskSensitiveHeaders(headers: Record<string, string>) {
  const sensitiveHeaders = ["authorization", "cookie"];

  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      sensitiveHeaders.includes(key.toLowerCase())
        ? `${value.slice(0, 2)}****${value.slice(-1)}`
        : value,
    ]),
  );
}

export function registerLogger(app: App) {
  app.use(async (c, next) => {
    const reqHeader = maskSensitiveHeaders(c.req.header());
    const query = c.req.query();

    const reqIn = {
      query,
      type: "In",
      path: c.req.path,
      method: c.req.method,
      header: reqHeader,
    };

    logger.info(reqIn);

    const startTime = performance.now();
    await next();
    const endTime = performance.now();

    const duration = Math.round(endTime - startTime) * 1000_000;
    const status = c.res.status;
    const resHeader = maskSensitiveHeaders(Object.fromEntries(c.res.headers));

    const resOut = {
      type: "Out",
      duration,
      status,
      header: resHeader,
    };
    logger.info(resOut);
  });
}
