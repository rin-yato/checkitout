import { DEFAULT_CONNECTION } from "@/lib/tasker";
import { Queue } from "bullmq";

export const TRANSACTION_QUEUE_NAME = "{transaction}";

const DELAY = 5000;
const MAXIMUM_ATTEMPTS = 60;
const REMOVE_ON_FAIL = { count: 6500 };
const REMOVE_ON_SUCCESS = { count: 4000 };
const BACKOFF = { type: "fixed", delay: 3000 };

export class TransactionQueue {
  queue;

  constructor() {
    this.queue = new Queue(TRANSACTION_QUEUE_NAME, {
      connection: DEFAULT_CONNECTION,
    });
  }

  async add(transactionId: string, md5: string) {
    const job = await this.queue.getJob(md5);

    if (!job) {
      await this.queue.add(
        TRANSACTION_QUEUE_NAME,
        { md5, transactionId },
        {
          jobId: md5,
          delay: DELAY,
          backoff: BACKOFF,
          attempts: MAXIMUM_ATTEMPTS,
          removeOnFail: REMOVE_ON_FAIL,
          removeOnComplete: REMOVE_ON_SUCCESS,
        },
      );
      return;
    }

    const isFailed = await job?.isFailed();

    if (isFailed) {
      await this.queue.remove(md5);
      await this.queue.add(
        TRANSACTION_QUEUE_NAME,
        { md5, transactionId },
        {
          jobId: md5,
          delay: DELAY,
          backoff: BACKOFF,
          attempts: MAXIMUM_ATTEMPTS,
          removeOnFail: REMOVE_ON_FAIL,
          removeOnComplete: REMOVE_ON_SUCCESS,
        },
      );
    }
  }
}

export const transactionQueue = new TransactionQueue();
