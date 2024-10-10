import { and, count, desc, eq, isNull } from "drizzle-orm";
import type { User } from "lucia";
import { z } from "@hono/zod-openapi";
import { err, ok, type Result } from "@justmiracle/result";

import { db, takeFirstOrThrow, type DBTrx } from "@/lib/db";
import { transactionServcie } from "./transaction.service";

import {
  CHECKOUT_ID_PREFIX,
  TB_checkout,
  TB_checkoutItem,
  TB_checkoutSequence,
} from "@repo/db/table";
import { checkoutInsert, checkoutItemInsert, type CheckoutInsert } from "@repo/db/schema";
import { genId } from "@/lib/id";
import { apiError } from "@/lib/error";
import { isValidUrl } from "@/lib/is";
import {
  checkoutCreateV1Response,
  type CheckoutCreateV1Response,
  type CheckoutCreateV1Body,
} from "@repo/schema";

export class CheckoutService {
  async create(
    user: User,
    { items, ...checkoutReq }: CheckoutCreateV1Body,
  ): Promise<Result<CheckoutCreateV1Response>> {
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

    const checkoutSequence = await this.getNextSequence(user.id);

    const checkoutId = genId(CHECKOUT_ID_PREFIX);

    const checkoutData = checkoutInsert.safeParse({
      ...checkoutReq,
      userId: user.id,
      refId: `C${checkoutSequence}`,
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

    return db
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

        await this.updateSequence(user.id, checkoutSequence, tx);

        return { checkout, items, activeTransaction: transaction };
      })
      .then((data) => {
        const response = checkoutCreateV1Response.safeParse(data);

        if (response.error) {
          throw apiError({
            status: 500,
            message: "Failed to parse response data",
            details: response.error.formErrors,
          });
        }

        return ok(response.data);
      })
      .catch(err);
  }

  async getNextSequence(userId: string) {
    const checkoutSequence = await db.query.TB_checkoutSequence.findFirst({
      where: eq(TB_checkoutSequence.userId, userId),
    })
      .then(ok)
      .catch(err);

    if (checkoutSequence.error) {
      throw apiError({
        status: 500,
        message: "Failed to get checkout sequence",
        details: checkoutSequence.error,
      });
    }

    if (!checkoutSequence.value) {
      throw apiError({
        status: 500,
        message: "User does not have a checkout sequence",
      });
    }

    return checkoutSequence.value.sequence + 1;
  }

  async updateSequence(userId: string, newSequence: number, dbOrTx: DBTrx = db) {
    return await dbOrTx
      .update(TB_checkoutSequence)
      .set({ sequence: newSequence })
      .where(eq(TB_checkoutSequence.userId, userId))
      .returning()
      .then(takeFirstOrThrow);
  }

  findById(id: string) {
    return db.query.TB_checkout.findFirst({
      where: eq(TB_checkout.id, id),
      with: { transactions: true, items: true, webhooks: true },
    })
      .then(ok)
      .catch(err);
  }

  async findMany(userId: string, opts: { page: number; perPage: number }) {
    const condition = and(eq(TB_checkout.userId, userId), isNull(TB_checkout.deletedAt));

    const query = db.query.TB_checkout.findMany({
      where: condition,
      with: { transactions: true, items: true, webhooks: true },
      orderBy: [desc(TB_checkout.refId)],
      limit: opts.perPage,
      offset: (opts.page - 1) * opts.perPage,
    }).prepare("find-many-checkouts");

    const countQuery = db
      .select({ count: count() })
      .from(TB_checkout)
      .where(condition)
      .prepare("count-checkouts");

    const promises = await Promise.all([
      query.execute(),
      countQuery
        .execute()
        .then(takeFirstOrThrow)
        .then((data) => data.count),
    ])
      .then(ok)
      .catch(err);

    if (promises.error) return promises;

    const [checkouts, total] = promises.value;

    return ok({ checkouts, total });
  }
}

export const checkoutService = new CheckoutService();
