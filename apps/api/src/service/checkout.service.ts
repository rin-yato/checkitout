import { eq } from "drizzle-orm";
import type { User } from "lucia";
import { z } from "@hono/zod-openapi";
import { err, ok } from "@justmiracle/result";

import { db, takeFirstOrThrow } from "@/lib/db";
import { transactionQueue } from "@/task/transaction";
import { transactionServcie } from "./transaction.service";

import { TB_checkout, TB_checkoutItem } from "@repo/db/table";
import { checkoutInsert, checkoutItemInsert, type CheckoutInsert } from "@repo/db/schema";

export const checkoutRequestSchema = checkoutInsert.omit({ refId: true, userId: true }).extend({
  items: z.array(checkoutItemInsert.omit({ checkoutId: true }).openapi("CheckoutItem Insert"), {
    description: "An array of items for this checkout",
  }),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export class CheckoutService {
  create(user: User, { items, ...checkoutReq }: CheckoutRequest) {
    if (!user.bakongId) throw new Error("User has no bakongId");

    return db
      .transaction(async (trx) => {
        const checkoutData = checkoutInsert.safeParse({
          ...checkoutReq,
          userId: user.id,
          refId: "123",
        } satisfies CheckoutInsert);

        if (!checkoutData.success) throw new Error("Invalid checkout data");

        const checkout = await trx
          .insert(TB_checkout)
          .values(checkoutData.data)
          .returning()
          .then(takeFirstOrThrow)
          .then(ok)
          .catch(err);

        if (checkout.error) throw checkout.error;

        const checkoutId = checkout.value.id;

        const itemData = items.map((item) => ({ ...item, checkoutId }));

        const itemsResult = await trx
          .insert(TB_checkoutItem)
          .values(itemData)
          .returning()
          .then(ok)
          .catch(err);

        if (itemsResult.error) throw itemsResult.error;

        return { items: itemsResult.value, ...checkout.value };
      })
      .then(ok)
      .catch(err);
  }

  portal(id: string) {
    return db
      .transaction(
        async (trx) => {
          const checkout = await trx.query.TB_checkout.findFirst({
            where: eq(TB_checkout.id, id),
            with: { transactions: true, items: true, user: true },
          });

          if (!checkout) throw new Error("Checkout not found");

          const successTransaction = checkout.transactions.find((t) => t.status === "SUCCESS");

          if (successTransaction) {
            return { ...checkout, status: "SUCCESS", activeTransaction: null };
          }

          let activeTransaction = checkout.transactions.find((t) => t.status === "PENDING");

          if (!activeTransaction) {
            const transaction = await transactionServcie.createTransaction(
              {
                checkoutId: checkout.id,
                currency: checkout.currency,
                amount: checkout.total,
                merchantName: checkout.user.displayName,
                accountID: checkout.user.bakongId,
              },
              trx,
            );
            if (transaction.error) throw transaction.error;
            activeTransaction = transaction.value;
          }

          await transactionQueue.add(activeTransaction.id, activeTransaction.md5);

          return { ...checkout, activeTransaction };
        },
        { behavior: "deferred" },
      )
      .then(ok)
      .catch(err);
  }
}

export const checkoutService = new CheckoutService();
