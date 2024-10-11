import { db } from "@/lib/db";
import { apiError } from "@/lib/error";
import { withRetry } from "@/lib/retry";
import { webhookService } from "@/service/webhook.service";
import { logger } from "@/setup/logger";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { err, ok, unwrap } from "@justmiracle/result";
import ky from "ky";

export const checkoutRetryWebhookV1 = new OpenAPIHono().openapi(
  createRoute({
    method: "post",
    path: "/v1/checkout/{id}/retry-webhook",
    summary: "Retry a webhook",
    operationId: "Retry a webhook",
    tags: ["Checkout"],
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: {
        description: "Webhook sent successfully",
      },
      400: {
        description: "Webhook failed",
      },
      404: {
        description: "Checkout not found",
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const checkoutQuery = db.query.TB_checkout.findFirst({
      where: (t, ops) => ops.eq(t.id, id),
      with: { user: true },
    }).prepare("find-checkout-for-retrying-webhook");

    const checkout = await checkoutQuery.execute().then(ok).catch(err);

    if (checkout.error || !checkout.value) {
      throw apiError({
        status: 404,
        message: "Checkout not found",
        details: checkout.error?.message,
      });
    }

    const response = await ky
      .post(checkout.value.user.webhookUrl, {
        retry: 0,
        redirect: "manual",
        json: { checkoutId: checkout.value.id },
        throwHttpErrors: false,
      })
      .then(ok)
      .catch(err);

    if (response.error) {
      logger.error(response.error, "Failed to send webhook");
      webhookService.create({
        status: 500,
        userId: checkout.value.userId,
        checkoutId: checkout.value.id,
        json: { error: response.error.message },
      });
      throw apiError({
        status: 400,
        message: "Failed to send webhook",
        details: response.error.message,
      });
    }

    const json = await response.value.json<Record<string, unknown>>().catch(() => ({
      error: "INVALID_JSON",
    }));

    if (!response.value.ok) {
      logger.error({ response: response.value, json }, "Failed to send webhook http error");
      webhookService.create({
        json,
        status: response.value.status,
        userId: checkout.value.userId,
        checkoutId: checkout.value.id,
      });
      throw apiError({
        status: 400,
        message: `Webhook return with http error ${response.value.status}`,
      });
    }

    logger.info({ response: response.value, json }, "Webhook sent successfully");

    const checkoutData = checkout.value;

    const result = await withRetry(
      async () =>
        await webhookService
          .create({
            json,
            userId: checkoutData.userId,
            checkoutId: checkoutData.id,
            status: response.value.status,
          })
          .then(unwrap),
      5,
    );

    if (result.error) {
      throw apiError({
        status: 500,
        message: "Failed to create webhook",
        details: result.error.message,
      });
    }

    return c.json(null);
  },
);
