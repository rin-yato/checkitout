import type { App } from "@/setup/context";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { HonoAdapter } from "@bull-board/hono";
import { Queue, type Worker } from "bullmq";
import { serveStatic } from "hono/bun";
import { env } from "./env";
import { basicAuth } from "hono/basic-auth";
import { BASIC_AUTH } from "@/constant/basic-auth";

export function registerTasker(app: App, taskers: Tasker[]) {
  // start all taskers
  taskers.forEach((tasker) => tasker.start());

  const serverAdapter = new HonoAdapter(serveStatic);

  createBullBoard({
    queues: taskers.map(createBullAdapter),
    serverAdapter,
  });

  serverAdapter.setBasePath("/queue");

  app.use("/queue", basicAuth(BASIC_AUTH)).route("/queue", serverAdapter.registerPlugin());
}

function createBullAdapter(tasker: Tasker) {
  return new BullMQAdapter(
    new Queue(tasker.worker.name, {
      connection: DEFAULT_CONNECTION,
    }),
  );
}

export const DEFAULT_CONNECTION = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
};

export interface Tasker {
  worker: Worker;
  start(): Promise<void>;
  shutdown(): Promise<void>;
}
