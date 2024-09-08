import { BAKONG_API_URL } from "@/module/transaction/lib/config";
import type { TransactionResponse } from "@/module/transaction/lib/type";
import ky from "ky";
import { CURRENCY, KHQR, TAG } from "ts-khqr";

const ACCOUNT_ID = "vichiny_vouch@aclb";

class TransactionService {
  private token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNjJjMWIzMWQ4NWFlNDdkIn0sImlhdCI6MTcyNTQ3Mzc4NSwiZXhwIjoxNzMzMjQ5Nzg1fQ.Tedo-oYI7h9L3KjSIfDN3ovO_5EIRbMpPekvDg-oxt4";
  private api = ky.extend({
    prefixUrl: BAKONG_API_URL,
  });

  createTransaction(amount: number) {
    const khqr = KHQR.generate({
      tag: TAG.INDIVIDUAL,
      merchantName: "Vichiny Vouch",
      accountID: ACCOUNT_ID,
      currency: CURRENCY.KHR,
      amount,
    });

    return khqr;
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
