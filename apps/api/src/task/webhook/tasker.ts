import { DEFAULT_CONNECTION, type Tasker } from "@/lib/tasker";
import { WEBHOOK_QUEUE_NAME } from "./queue";
import { Worker, type Job } from "bullmq";

export class WebhookTasker implements Tasker {
  worker;

  constructor() {
    this.worker = new Worker(WEBHOOK_QUEUE_NAME, this.process, {
      autorun: false,
      connection: DEFAULT_CONNECTION,
      concurrency: 20,
    });

    this.worker.on("ready", () => {
      console.log("Webhook worker is ready ✅");
    });

    this.worker.on("closing", () => {
      console.log("Webhook worker is closing");
    });
  }

  async start() {
    await this.worker.run();
  }

  async shutdown() {
    await this.worker.close();
  }

  async process(job: Job) {}
}
