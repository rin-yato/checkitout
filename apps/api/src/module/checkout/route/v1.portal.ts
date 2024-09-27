import { db } from "@/lib/db";
import { apiError } from "@/lib/error";
import { isSuccessStatus } from "@/lib/is";
import { withRetry } from "@/lib/retry";
import { transactionServcie } from "@/service/transaction.service";
import type { AppEnv } from "@/setup/context";
import { transactionQueue } from "@/task/transaction";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { err, ok } from "@justmiracle/result";
import { TB_checkout } from "@repo/db/table";
import { checkoutPortalV1Response } from "@repo/schema";
import { eq } from "drizzle-orm";

export const checkoutPortalV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "get",
    path: "/v1/checkout/portal/{checkoutId}",
    tags: ["Checkout"],
    request: {
      params: z.object({ checkoutId: z.string() }),
    },
    responses: {
      200: {
        description: "Checkout portal",
        content: {
          "application/json": {
            schema: checkoutPortalV1Response,
          },
        },
      },
    },
  }),
  async (c) => {
    const checkoutId = c.req.param("checkoutId");

    const { value: checkout, error: checkoutError } = await db.query.TB_checkout.findFirst({
      where: eq(TB_checkout.id, checkoutId),
      with: {
        transactions: true,
        webhooks: true,
        items: true,
        user: true,
      },
    })
      .then(ok)
      .catch(err);

    if (checkoutError) {
      throw apiError({
        status: 500,
        message: "Failed to query checkout",
        details: checkoutError.message,
      });
    }

    if (!checkout) {
      throw apiError({
        status: 404,
        message: "Checkout not found",
      });
    }

    const hasSuccessfulTransaction = checkout.transactions.some((t) => t.status === "SUCCESS");
    const hasSuccessfulWebhook = checkout.webhooks.some((w) => isSuccessStatus(w.status));

    const { user, webhooks, transactions, ...checkoutOnly } = checkout;

    if (hasSuccessfulTransaction) {
      const { data, error } = checkoutPortalV1Response.safeParse({
        user,
        checkout: checkoutOnly,
        activeTransaction: null,
        hasSuccessfulTransaction,
        hasSuccessfulWebhook,
      });

      if (error) {
        throw apiError({
          status: 500,
          message: "Failed to parse response",
          details: error.flatten(),
        });
      }

      return c.json(data);
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
    withRetry(
      () =>
        transactionQueue.add({
          userId: checkout.userId,
          checkoutId: checkout.id,
          webhookUrl: checkout.user.webhookUrl,
          transactionId: activeTransaction.id,
          md5: activeTransaction.md5,
        }),
      5, // retry 5 times
    );

    const { data, error } = checkoutPortalV1Response.safeParse({
      user,
      activeTransaction,
      checkout: checkoutOnly,
      hasSuccessfulTransaction,
      hasSuccessfulWebhook,
    });

    if (error) {
      throw apiError({
        status: 500,
        message: "Failed to parse response",
        details: error,
      });
    }

    return c.json(data);
  },
);
