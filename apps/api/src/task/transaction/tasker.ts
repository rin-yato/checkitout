import { DEFAULT_CONNECTION, type Tasker } from "@/lib/tasker";
import { type Job, UnrecoverableError, Worker } from "bullmq";
import { TRANSACTION_QUEUE_NAME } from "./queue";
import { bakongService } from "@/service/bakong.service";
import { transactionServcie } from "@/service/transaction.service";

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
    // if the job age exceeds 5mn, it will be considered failed
    const TIMEOUT = 1000 * 60 * 5;
    if (job.timestamp + TIMEOUT < Date.now()) {
      job.log("Transaction Expired");
      throw new UnrecoverableError("Transaction Expired");
    }

    const transactionStatus = await bakongService.getTransactionByMd5(job.data.md5);

    if (transactionStatus.error) {
      job.log(`Failed to get transaction status: ${transactionStatus.error.message}`);
      throw transactionStatus.error;
    }

    // if we get error code
    if (transactionStatus.value.responseCode === 1) {
      // error code 1 means transaction failed
      if (transactionStatus.value.errorCode === 3) {
        job.log(`Transaction failed: ${transactionStatus.value.responseMessage}`);
        throw new UnrecoverableError(transactionStatus.value.responseMessage);
      }

      // otherwise, it's not found
      job.log(`Transaction not found, attempt number: ${job.attemptsStarted}`);
      throw new Error(transactionStatus.value.responseMessage);
    }

    const result = await transactionServcie.transactionSuccess(
      job.data.md5,
      transactionStatus.value,
    );

    if (result.error) {
      // this should try to reprocess the transaction
      job.log(`Failed to update transaction status to success: ${result.error.message}`);
      throw result.error;
    }

    await job.updateProgress(100);
    job.log("Transaction is successful");
  }
}
