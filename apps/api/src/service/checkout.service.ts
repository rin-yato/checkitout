import { z } from "@hono/zod-openapi";
import { db, takeFirstOrThrow } from "@/lib/db";
import { err, ok } from "@justmiracle/result";
import { checkoutInsert, checkoutItemInsert, type CheckoutInsert } from "@repo/db/schema";
import { TB_checkout, TB_checkoutItem } from "@repo/db/table";

export const checkoutRequestSchema = checkoutInsert.omit({ refId: true, userId: true }).extend({
  items: z.array(checkoutItemInsert.omit({ checkoutId: true }).openapi("CheckoutItem Insert"), {
    description: "An array of items for this checkout",
  }),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export class CheckoutService {
  create(userId: string, { items, ...checkoutReq }: CheckoutRequest) {
    return db
      .transaction(async (trx) => {
        const checkoutData = checkoutInsert.safeParse({
          ...checkoutReq,
          userId,
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
}

export const checkoutService = new CheckoutService();
