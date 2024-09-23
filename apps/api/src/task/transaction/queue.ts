import { DEFAULT_CONNECTION } from "@/lib/tasker";
import { type Job, Queue } from "bullmq";

export const TRANSACTION_QUEUE_NAME = "{transaction}";

const DELAY = 5000;
const MAXIMUM_ATTEMPTS = 120;
const REMOVE_ON_FAIL = { count: 8500 };
const REMOVE_ON_SUCCESS = { count: 5500 };
const BACKOFF = { type: "fixed", delay: 3200 };

export type TransactionJobData = {
  md5: string;
  transactionId: string;
  checkoutId: string;
  userId: string;
  webhookUrl: string;
};
export type TransactionJob = Job<TransactionJobData>;

export class TransactionQueue {
  queue;

  constructor() {
    this.queue = new Queue<TransactionJobData>(TRANSACTION_QUEUE_NAME, {
      connection: DEFAULT_CONNECTION,
    });
  }

  async add(data: TransactionJobData) {
    return await this.queue.add(TRANSACTION_QUEUE_NAME, data, {
      jobId: data.transactionId,
      delay: DELAY,
      backoff: BACKOFF,
      attempts: MAXIMUM_ATTEMPTS,
      removeOnFail: REMOVE_ON_FAIL,
      removeOnComplete: REMOVE_ON_SUCCESS,
    });
  }
}

export const transactionQueue = new TransactionQueue();
