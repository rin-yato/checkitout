import { DEFAULT_CONNECTION } from "@/lib/tasker";
import { Queue } from "bullmq";

export const TRANSACTION_QUEUE_NAME = "{transaction}";

const DELAY = 5000;
const MAXIMUM_ATTEMPTS = 120;
const REMOVE_ON_FAIL = { count: 8500 };
const REMOVE_ON_SUCCESS = { count: 5500 };
const BACKOFF = { type: "fixed", delay: 3200 };

export class TransactionQueue {
  queue;

  constructor() {
    this.queue = new Queue(TRANSACTION_QUEUE_NAME, {
      connection: DEFAULT_CONNECTION,
    });
  }

  async add(transactionId: string, md5: string) {
    return await this.queue.add(
      TRANSACTION_QUEUE_NAME,
      { md5, transactionId },
      {
        jobId: transactionId,
        delay: DELAY,
        backoff: BACKOFF,
        attempts: MAXIMUM_ATTEMPTS,
        removeOnFail: REMOVE_ON_FAIL,
        removeOnComplete: REMOVE_ON_SUCCESS,
      },
    );
  }
}

export const transactionQueue = new TransactionQueue();
