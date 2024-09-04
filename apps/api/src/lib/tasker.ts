import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { HonoAdapter } from "@bull-board/hono";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { Queue, type Worker } from "bullmq";
import { serveStatic } from "hono/bun";

export function registerTasker(app: OpenAPIHono, taskers: Tasker[]) {
  for (const tasker of taskers) {
    tasker.start();
  }

  const serverAdapter = new HonoAdapter(serveStatic);

  createBullBoard({
    queues: taskers.map((tasker) => new BullMQAdapter(new Queue(tasker.worker.name))),
    serverAdapter,
  });

  serverAdapter.setBasePath("/queue");

  app.route("/queue", serverAdapter.registerPlugin());
}

export const DEFAULT_CONNECTION = {
  host: "127.0.0.1",
  port: 6379,
};

export interface Tasker {
  worker: Worker;
  start(): Promise<void>;
  shutdown(): Promise<void>;
}
