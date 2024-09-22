import { DEFAULT_CONNECTION } from "@/lib/tasker";
import type { Webhook } from "@repo/db/schema";
import { type Job, Queue } from "bullmq";

export const WEBHOOK_QUEUE_NAME = "{webhook}";

const REMOVE_ON_FAIL = { count: 8500 };
const REMOVE_ON_SUCCESS = { count: 5500 };
const BACKOFF = { type: "exponential", delay: 500 };
const ATTMEPTS = 5;

export type WebhookJob = Job<Webhook>;

class WebhookQueue {
  queue;

  constructor() {
    this.queue = new Queue(WEBHOOK_QUEUE_NAME, {
      connection: DEFAULT_CONNECTION,
    });
  }

  async add() {
    const job = await this.queue.getJob("h");

    if (job) {
      await job.retry("failed");
      return;
    }

    return await this.queue.add(
      WEBHOOK_QUEUE_NAME,
      {},
      {
        attempts: ATTMEPTS,
        backoff: BACKOFF,
        removeOnFail: REMOVE_ON_FAIL,
        removeOnComplete: REMOVE_ON_SUCCESS,
      },
    );
  }
}

export const webhookQueue = new WebhookQueue();
