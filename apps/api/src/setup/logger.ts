import pino from "pino";
import type { App } from "./context";
import { getConnInfo } from "hono/bun";
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

export function registerLogger(app: App) {
  app.use(async (c, next) => {
    const connInfo = getConnInfo(c);

    const reqIn = {
      type: "In",
      path: c.req.path,
      referer: c.req.header("referer"),
      "user-agent": c.req.header("user-agent"),
      ua: c.req.header("sec-ch-ua"),
      "ua-mobile": c.req.header("sec-ch-ua-mobile"),
      "ua-platform": c.req.header("sec-ch-ua-platform"),
      "client-conn": connInfo.remote,
    };
    logger.info(reqIn);

    const startTime = performance.now();
    await next();
    const endTime = performance.now();

    const duration = Math.round(endTime - startTime) * 1000_000;
    const status = c.res.status;

    const resOut = {
      type: "Out",
      duration,
      status,
    };
    logger.info(resOut);
  });
}
