import { response } from "@/lib/route";
import { transactionServcie } from "@/service/transaction.service";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { transactionWithRef } from "@repo/db/schema";

export const getTransactionByMd5V1 = new OpenAPIHono().openapi(
  createRoute({
    method: "get",
    path: "/v1/transaction/md5/{md5}",
    tags: ["Transaction"],
    request: { params: z.object({ md5: z.string() }) },
    responses: {
      200: response({
        schema: z.object({
          data: transactionWithRef.openapi("Transaction with Ref"),
        }),
        description: "Transaction details",
      }),
    },
  }),
  async (c) => {
    const md5 = c.req.param("md5");
    const transaction = await transactionServcie.getTransactionByMd5(md5);
    return c.json({ data: transaction });
  },
);
