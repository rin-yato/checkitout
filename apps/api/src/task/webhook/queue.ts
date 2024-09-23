import { withRetry } from "@/lib/retry";
import { DEFAULT_CONNECTION } from "@/lib/tasker";
import { err, ok } from "@justmiracle/result";
import { type Job, Queue } from "bullmq";

export const WEBHOOK_QUEUE_NAME = "{webhook}";

const REMOVE_ON_FAIL = { count: 8500 };
const REMOVE_ON_SUCCESS = { count: 5500 };
const BACKOFF = { type: "exponential", delay: 500 };
const ATTMEPTS = 5;

export type WebhookJobData = { checkoutId: string; webhookUrl: string; userId: string };

export type WebhookJob = Job<WebhookJobData>;

class WebhookQueue {
  queue;

  constructor() {
    this.queue = new Queue<WebhookJobData>(WEBHOOK_QUEUE_NAME, {
      connection: DEFAULT_CONNECTION,
    });
  }

  async add(opts: WebhookJobData) {
    const job = await this.queue.getJob(opts.checkoutId);

    if (job) {
      const isFailed = await job.isFailed().then(ok).catch(err);
      if (isFailed.error) return isFailed;

      withRetry(() => job.retry("failed"));

      return ok(job);
    }

    return this.queue
      .add(WEBHOOK_QUEUE_NAME, opts, {
        jobId: opts.checkoutId,
        attempts: ATTMEPTS,
        backoff: BACKOFF,
        removeOnFail: REMOVE_ON_FAIL,
        removeOnComplete: REMOVE_ON_SUCCESS,
      })
      .then(ok)
      .catch(err);
  }
}

export const webhookQueue = new WebhookQueue();
