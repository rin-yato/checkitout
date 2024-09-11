import { db, takeFirstOrThrow } from "@/lib/db";
import { TB_checkout, TB_transaction, TB_transactionRef } from "@repo/db/table";
import type { Currency } from "@/constant/bakong";

import { err, ok } from "@justmiracle/result";

import { bakongService } from "./bakong.service";
import type { TransactionSuccess } from "@/type/bakong";
import { eq } from "drizzle-orm";

interface CreateTransactionOpts {
  amount: number;
  accountID: string;
  currency: Currency;
  merchantName: string;
  checkoutId: string;
}

class TransactionService {
  createTransactionQuery(opts: CreateTransactionOpts) {
    const khqr = bakongService.createKHQR({
      amount: opts.amount,
      currency: opts.currency,
      accountID: opts.accountID,
      merchantName: opts.merchantName,
    });

    if (khqr.error) throw khqr.error;

    return db
      .insert(TB_transaction)
      .values({
        amount: opts.amount,
        currency: opts.currency,
        md5: khqr.value.md5,
        qrCode: khqr.value.qr,
        checkoutId: opts.checkoutId,
      })
      .returning();
  }

  getTransactionByMd5(md5: string) {
    return db.query.TB_transaction.findFirst({
      where: eq(TB_transaction.md5, md5),
      with: { transactionRef: true },
    })
      .then(ok)
      .catch(err);
  }

  async verifyTransaction(md5: string) {
    const [bakongTrx, trx] = await Promise.all([
      bakongService.getTransactionByMd5(md5),
      this.getTransactionByMd5(md5),
    ]);

    if (bakongTrx.error) return bakongTrx;

    if (trx.error) return trx;
    if (!trx.value) return err("TRANSACTION_NOT_FOUND");

    if (bakongTrx.value.responseCode === 0 && trx.value.status !== "SUCCESS") {
      return this.transactionSuccess(md5, bakongTrx.value);
    }

    return ok(trx.value);
  }

  transactionSuccess(md5: string, { data }: TransactionSuccess) {
    return db
      .transaction(async (trx) => {
        const updatedTrx = await trx
          .update(TB_transaction)
          .set({ status: "SUCCESS" })
          .where(eq(TB_transaction.md5, md5))
          .returning()
          .then(takeFirstOrThrow);

        await trx
          .update(TB_checkout)
          .set({ status: "SUCCESS" })
          .where(eq(TB_checkout.id, updatedTrx.checkoutId));

        const trxRef = await trx
          .insert(TB_transactionRef)
          .values({
            transactionId: updatedTrx.id,

            hash: data.hash,
            md5: updatedTrx.md5,
            qrCode: updatedTrx.qrCode,

            currency: data.currency,
            amount: data.amount,

            toAccountId: data.toAccountId,
            fromAccountId: data.fromAccountId,
          })
          .returning()
          .then(takeFirstOrThrow);

        return { ...updatedTrx, transactionRef: trxRef };
      })
      .then(ok)
      .catch(err);
  }
}

export const transactionServcie = new TransactionService();
