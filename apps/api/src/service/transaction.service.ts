import ky from "ky";
import { CURRENCY, KHQR, TAG } from "ts-khqr";
import type { Currency } from "@/constant/khqr";

import type { TransactionResponse } from "@/module/transaction/lib/type";
import { BAKONG_API_URL } from "@/module/transaction/lib/config";
import { env } from "@/lib/env";
import { db, takeFirstOrThrow } from "@/lib/db";
import { TB_transaction } from "@repo/db/table";
import { err, ok } from "@justmiracle/result";

interface CreateTransactionOpts {
  amount: number;
  accountID: string;
  currency: Currency;
  merchantName: string;
  checkoutId: string;
}

class TransactionService {
  private token = env.BAKONG_TOKEN;
  private api = ky.extend({
    prefixUrl: BAKONG_API_URL,
  });

  createTransaction(opts: CreateTransactionOpts) {
    const khqr = KHQR.generate({
      tag: TAG.INDIVIDUAL,
      merchantName: opts.merchantName,
      accountID: opts.accountID,
      currency: CURRENCY[opts.currency],
      amount: opts.amount,
    });

    if (khqr.data === null) {
      throw new Error(khqr.status.message ?? "Unable to generate KHQR code");
    }

    return db
      .insert(TB_transaction)
      .values({
        amount: opts.amount,
        currency: opts.currency,
        md5: khqr.data.md5,
        qrCode: khqr.data.qr,
        checkoutId: opts.checkoutId,
      })
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
  }

  async getTransactionByMd5(md5: string) {
    const transaction = await this.api
      .post("v1/check_transaction_by_md5", {
        json: { md5 },
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .json<TransactionResponse>();

    return transaction;
  }

  async getTransactions() {
    // Get all transactions
  }

  async updateTransaction() {
    // Update a transaction
  }

  async deleteTransaction() {
    // Delete a transaction
  }
}

export const transactionServcie = new TransactionService();
