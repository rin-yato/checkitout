import { createRoute, response } from "@/lib/route";
import { transactionServcie } from "@/service/transaction.service";
import { z } from "@hono/zod-openapi";

export const createTransaction = createRoute(
  {
    method: "post",
    path: "/transaction/create",
    request: {
      body: { content: { "application/json": { schema: z.object({ amount: z.number() }) } } },
    },
    responses: {
      200: response({
        description: "Transaction created",
        schema: z.object({ data: z.any() }),
      }),
      400: response({
        description: "Error",
        schema: z.object({ error: z.string() }),
      }),
    },
  },
  async (c) => {
    const { amount } = await c.req.json();

    const transaction = transactionServcie.createTransaction(amount);

    if (!transaction.data) {
      return c.json({ error: "sth went wrong" }, 400);
    }

    // await transactionQueue.add(transaction.data.md5);

    return c.json({ data: transaction.data });
  },
);
