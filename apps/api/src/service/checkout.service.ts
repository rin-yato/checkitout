import { eq } from "drizzle-orm";
import type { User } from "lucia";
import { z } from "@hono/zod-openapi";
import { err, ok } from "@justmiracle/result";

import { db, takeFirstOrThrow } from "@/lib/db";
import { transactionQueue } from "@/task/transaction";
import { transactionServcie } from "./transaction.service";

import { CHECKOUT_ID_PREFIX, TB_checkout, TB_checkoutItem } from "@repo/db/table";
import { checkoutInsert, checkoutItemInsert, type CheckoutInsert } from "@repo/db/schema";
import { genId } from "@/lib/id";
import { withRetry } from "@/lib/retry";
import { apiError } from "@/lib/error";
import { isValidUrl } from "@/lib/is";

export const checkoutRequestSchema = checkoutInsert.omit({ refId: true, userId: true }).extend({
  items: z.array(checkoutItemInsert.omit({ checkoutId: true }).openapi("CheckoutItem Insert"), {
    description: "An array of items for this checkout",
  }),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export class CheckoutService {
  async create(user: User, { items, ...checkoutReq }: CheckoutRequest) {
    if (!user.bakongId) {
      throw apiError({
        status: 400,
        name: "NO_BAKONG_ID",
        message: "User does not have a Bakong ID",
      });
    }

    if (!isValidUrl(user.webhookUrl)) {
      throw apiError({
        status: 400,
        message: "User does not have a valid webhook",
      });
    }

    const checkoutId = genId(CHECKOUT_ID_PREFIX);

    const checkoutData = checkoutInsert.safeParse({
      ...checkoutReq,
      userId: user.id,
      refId: "123", // TODO: Implement refId
      id: checkoutId,
    } satisfies CheckoutInsert);

    if (!checkoutData.success) {
      throw apiError({
        status: 400,
        name: "INVALID_DATA",
        message: "Invalid checkout data",
        details: checkoutData.error.flatten,
      });
    }

    const itemInserts = z
      .array(checkoutItemInsert)
      .safeParse(items.map((item) => ({ ...item, checkoutId })));
    if (!itemInserts.success) {
      throw apiError({
        status: 400,
        name: "INVALID_DATA",
        message: "Invalid items data",
        details: itemInserts.error.flatten,
      });
    }

    const txResult = await db
      .transaction(async (tx) => {
        const checkout = await tx
          .insert(TB_checkout)
          .values(checkoutData.data)
          .returning()
          .then(takeFirstOrThrow);
        const items = await tx.insert(TB_checkoutItem).values(itemInserts.data).returning();
        const transaction = await transactionServcie.createTransactionQuery(
          {
            checkoutId: checkoutId,
            currency: checkoutData.data.currency,
            amount: checkoutData.data.total,
            merchantName: user.displayName,
            accountID: user.bakongId,
          },
          tx,
        );

        return { checkout, items, transaction };
      })
      .then(ok)
      .catch(err);

    return txResult;
  }

  async portal(id: string) {
    const checkout = await db.query.TB_checkout.findFirst({
      where: eq(TB_checkout.id, id),
      with: {
        transactions: true,
        items: true,
        user: {
          columns: {
            waitBeforeRedirect: true,
            email: true,
            phone: true,
            address: true,
            profile: true,
            displayName: true,
            username: true,
            bakongId: true,
            webhookUrl: true,
          },
        },
      },
    });

    if (!checkout) {
      throw apiError({
        status: 404,
        message: "Checkout not found",
      });
    }

    if (checkout.status === "SUCCESS") {
      const {
        user: { webhookUrl, ...user },
        transactions,
        ...checkoutOnly
      } = checkout;
      return ok({ checkout: checkoutOnly, user, activeTransaction: null });
    }

    let activeTransaction = checkout.transactions.find((t) => t.status === "PENDING");

    if (!activeTransaction) {
      const transaction = await transactionServcie
        .createTransactionQuery({
          checkoutId: checkout.id,
          currency: checkout.currency,
          amount: checkout.total,
          merchantName: checkout.user.displayName,
          accountID: checkout.user.bakongId,
        })
        .then(ok)
        .catch(err);

      if (transaction.error) {
        throw apiError({
          status: 500,
          message: "Failed to create transaction",
          details: transaction.error.message,
        });
      }
      activeTransaction = transaction.value;
    }

    // Add transaction to queue without waiting
    withRetry(() =>
      transactionQueue.add({
        userId: checkout.userId,
        checkoutId: checkout.id,
        webhookUrl: checkout.user.webhookUrl,
        transactionId: activeTransaction.id,
        md5: activeTransaction.md5,
      }),
    );

    // Ugly i know, but bare with me
    const {
      user: { webhookUrl, ...user },
      transactions,
      ...checkoutOnly
    } = checkout;

    return ok({ checkout: checkoutOnly, user, activeTransaction });
  }

  findById(id: string) {
    return db.query.TB_checkout.findFirst({
      where: eq(TB_checkout.id, id),
      with: { transactions: true, items: true },
    })
      .then(ok)
      .catch(err);
  }
}

export const checkoutService = new CheckoutService();
