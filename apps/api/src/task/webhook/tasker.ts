import { DEFAULT_CONNECTION, type Tasker } from "@/lib/tasker";
import { WEBHOOK_QUEUE_NAME, type WebhookJob, type WebhookJobData } from "./queue";
import { Worker } from "bullmq";
import ky from "ky";
import { err, ok, unwrap } from "@justmiracle/result";
import { logger } from "@/setup/logger";
import { webhookService } from "@/service/webhook.service";
import { withRetry } from "@/lib/retry";

export class WebhookTasker implements Tasker {
  worker;

  constructor() {
    this.worker = new Worker<WebhookJobData>(WEBHOOK_QUEUE_NAME, this.process, {
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

  async process(job: WebhookJob) {
    const response = await ky
      .post(job.data.webhookUrl, {
        retry: 0,
        redirect: "manual",
        json: { checkoutId: job.data.checkoutId },
        throwHttpErrors: false,
      })
      .then(ok)
      .catch(err);

    if (response.error) {
      job.log(`Failed to send webhook: ${response.error.message}`);
      logger.error(response.error, "Failed to send webhook");
      webhookService.create({
        status: 500,
        userId: job.data.userId,
        checkoutId: job.data.checkoutId,
        json: { error: response.error.message },
      });
      throw response.error;
    }

    const json = await response.value.json<Record<string, unknown>>().catch(() => ({
      error: "INVALID_JSON",
    }));

    if (!response.value.ok) {
      job.log(`Webhook return with http error ${response.value.status}`);
      logger.error({ response: response.value, json }, "Failed to send webhook http error");
      webhookService.create({
        json,
        status: response.value.status,
        userId: job.data.userId,
        checkoutId: job.data.checkoutId,
      });
      throw new Error(`Webhook return with http error ${response.value.status}`);
    }

    job.log("Webhook sent successfully");
    logger.info({ response: response.value, json }, "Webhook sent successfully");
    withRetry(async () => {
      await webhookService
        .create({
          json,
          status: response.value.status,
          userId: job.data.userId,
          checkoutId: job.data.checkoutId,
        })
        .then(unwrap);
    });
    job.updateProgress(100);
  }
}
