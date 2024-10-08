import { DEFAULT_CONNECTION, type Tasker } from "@/lib/tasker";
import { UnrecoverableError, Worker } from "bullmq";
import { TRANSACTION_QUEUE_NAME, type TransactionJob, type TransactionJobData } from "./queue";
import { bakongService } from "@/service/bakong.service";
import { transactionServcie } from "@/service/transaction.service";
import { logger } from "@/setup/logger";
import { withRetry } from "@/lib/retry";
import { webhookQueue } from "../webhook";

export class TransactionTasker implements Tasker {
  worker;

  constructor() {
    this.worker = new Worker<TransactionJobData>(TRANSACTION_QUEUE_NAME, this.process, {
      autorun: false,
      connection: DEFAULT_CONNECTION,
      concurrency: 20,
    });

    this.worker.on("ready", () => {
      console.log("Transaction worker is ready ✅");
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

  async process(job: TransactionJob) {
    // if the job age exceeds 5mn, it will be considered failed
    const TIMEOUT = 1000 * 60 * 5;
    if (job.timestamp + TIMEOUT < Date.now()) {
      const timeout = await transactionServcie.timeout(job.data.transactionId);

      if (timeout.error) {
        // this should try to set the transaction status to timeout again until max attempts
        job.log(`Failed to set transaction status to timeout: ${timeout.error.message}`);
        logger.error(timeout.error, "Failed to set transaction status to timeout");
        throw timeout.error;
      }

      job.log("Transaction Expired");
      throw new UnrecoverableError("Transaction Expired");
    }

    const transactionStatus = await bakongService.getTransactionByMd5(job.data.md5);

    if (transactionStatus.error) {
      job.log(`Failed to get transaction status: ${transactionStatus.error.message}`);
      logger.error(transactionStatus.error, "Failed to get transaction status");
      throw transactionStatus.error;
    }

    // if we get error code
    if (transactionStatus.value.responseCode === 1) {
      // error code 1 means transaction failed
      if (transactionStatus.value.errorCode === 3) {
        const failed = await transactionServcie.fail(job.data.transactionId);

        if (failed.error) {
          // this should try to reprocess the transaction
          job.log(`Failed to set transaction status to failed: ${failed.error.message}`);
          logger.error(failed.error, "Failed to set transaction status to failed");
          throw failed.error;
        }

        job.log(`Transaction failed: ${transactionStatus.value.responseMessage}`);
        logger.error(transactionStatus.value, "Transaction failed");
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
      logger.error(result.error, "Failed to update transaction status to success");
      throw result.error;
    }

    withRetry(async () => {
      await webhookQueue.add({
        userId: job.data.userId,
        checkoutId: job.data.checkoutId,
        webhookUrl: job.data.webhookUrl,
      });
    });

    await job.updateProgress(100);
    job.log("Transaction is successful");
  }
}
