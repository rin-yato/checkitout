import ky from "ky";
import { CURRENCY, KHQR, TAG } from "ts-khqr";

import { env } from "@/lib/env";
import type { Currency } from "@/constant/bakong";
import type { TransactionResponse } from "@/type/bakong";
import { err, ok } from "@justmiracle/result";

const BAKONG_API_URL = "https://api-bakong.nbc.gov.kh";

export interface KHQROpts {
  amount: number;
  accountID: string;
  currency: Currency;
  merchantName: string;
}

class BakongService {
  private token = env.BAKONG_TOKEN;
  private api = ky.extend({
    prefixUrl: BAKONG_API_URL,
    retry: 2,
  });

  createKHQR(opts: KHQROpts) {
    const khqr = KHQR.generate({
      tag: TAG.INDIVIDUAL,
      merchantName: opts.merchantName,
      accountID: opts.accountID,
      currency: CURRENCY[opts.currency],
      amount: opts.amount,
    });

    if (khqr.data === null) {
      return err(khqr.status.message ?? "Failed to generate KHQR");
    }

    return ok(khqr.data);
  }

  async getTransactionByMd5(md5: string) {
    return await this.api
      .post("v1/check_transaction_by_md5", {
        json: { md5 },
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .json<TransactionResponse>()
      .then(ok)
      .catch(err);
  }
}

export const bakongService = new BakongService();
