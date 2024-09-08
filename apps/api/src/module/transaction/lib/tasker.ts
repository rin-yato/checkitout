import { DEFAULT_CONNECTION, type Tasker } from "@/lib/tasker";
import { transactionServcie } from "@/service/transaction.service";
import { type Job, UnrecoverableError, Worker } from "bullmq";
import { TRANSACTION_QUEUE_NAME } from "./queue";

export class TransactionTasker implements Tasker {
  worker;

  constructor() {
    this.worker = new Worker(TRANSACTION_QUEUE_NAME, this.process, {
      autorun: false,
      connection: DEFAULT_CONNECTION,
      concurrency: 20,
    });

    this.worker.on("ready", () => {
      console.log("Transaction worker is ready");
    });

    this.worker.on("closing", () => {
      console.log("Transaction worker is closing");
    });
  }

  async start() {
    await this.worker.run();
  }

  async shutdown() {
    await this.worker.close();
  }

  async process(job: Job<{ md5: string }>) {
    // if the job age exceeds 5mn, it will be removed
    if (job.timestamp + 300000 < Date.now()) {
      throw new UnrecoverableError("Job is too old");
    }

    const transactionStatus = await transactionServcie.getTransactionByMd5(job.data.md5);

    if (transactionStatus.responseCode === 1) {
      if (transactionStatus.errorCode === 3) {
        // transaction failed
        throw new UnrecoverableError(transactionStatus.responseMessage);
      }

      // not found error
      throw new Error(transactionStatus.responseMessage);
    }

    await job.updateProgress(100);
    job.log("Transaction is successful");
  }
}
