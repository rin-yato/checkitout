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

export const checkoutRequestSchema = checkoutInsert.omit({ refId: true, userId: true }).extend({
  items: z.array(checkoutItemInsert.omit({ checkoutId: true }).openapi("CheckoutItem Insert"), {
    description: "An array of items for this checkout",
  }),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export class CheckoutService {
  async create(user: User, { items, ...checkoutReq }: CheckoutRequest) {
    if (!user.bakongId) throw new Error("User has no bakongId");

    const checkoutId = genId(CHECKOUT_ID_PREFIX);

    const checkoutData = checkoutInsert.safeParse({
      ...checkoutReq,
      userId: user.id,
      refId: "123", // TODO: Implement refId
      id: checkoutId,
    } satisfies CheckoutInsert);
    if (!checkoutData.success) throw new Error("Invalid checkout data");

    const itemInserts = z
      .array(checkoutItemInsert)
      .safeParse(items.map((item) => ({ ...item, checkoutId })));
    if (!itemInserts.success) throw new Error("Invalid items data");

    const createtransactionQuery = transactionServcie.createTransactionQuery({
      checkoutId: checkoutId,
      currency: checkoutData.data.currency,
      amount: checkoutData.data.total,
      merchantName: user.displayName,
      accountID: user.bakongId,
    });
    const createCheckoutQuery = db.insert(TB_checkout).values(checkoutData.data).returning();
    const createItemsQuery = db.insert(TB_checkoutItem).values(itemInserts.data).returning();

    const batch = await db
      .batch([createCheckoutQuery, createItemsQuery, createtransactionQuery])
      .then(ok)
      .catch(err);

    if (batch.error) return batch;

    const createdItems = batch.value[1];
    const checkout = takeFirstOrThrow(batch.value[0]);
    const transaction = takeFirstOrThrow(batch.value[2]);

    return ok({ checkout, items: createdItems, transaction });
  }

  async portal(id: string) {
    const checkout = await db.query.TB_checkout.findFirst({
      where: eq(TB_checkout.id, id),
      with: { transactions: true, items: true, user: true },
    });

    if (!checkout) return err("CHECKOUT_NOT_FOUND");

    if (checkout.status === "SUCCESS") {
      return ok({ ...checkout, activeTransaction: null });
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
        .then(takeFirstOrThrow)
        .then(ok)
        .catch(err);

      if (transaction.error) return transaction;
      activeTransaction = transaction.value;
    }

    // Add transaction to queue without waiting
    withRetry(
      () => transactionQueue.add(activeTransaction.id, activeTransaction.md5),
      3, // retries 3 times
    ).catch((err) => {
      console.error("Unable to add transaction to queue:", err);
    });

    return ok({ ...checkout, activeTransaction });
  }
}

export const checkoutService = new CheckoutService();
