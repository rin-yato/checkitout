import { DEFAULT_CONNECTION } from "@/lib/tasker";
import { Queue } from "bullmq";

export const TRANSACTION_QUEUE_NAME = "{transaction}";

export class TransactionQueue {
  queue;

  constructor() {
    this.queue = new Queue(TRANSACTION_QUEUE_NAME, {
      connection: DEFAULT_CONNECTION,
    });
  }

  async add(md5: string) {
    await this.queue.add(
      md5,
      { md5 },
      {
        jobId: md5,
        attempts: 60,
        delay: 5000,
        backoff: { type: "fixed", delay: 3000 },
      },
    );
  }
}

export const transactionQueue = new TransactionQueue();
