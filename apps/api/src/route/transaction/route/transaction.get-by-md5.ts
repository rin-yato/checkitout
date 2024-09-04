import { response } from "@/lib/route";
import { transactionServcie } from "@/service/transaction.service";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

export const getTransactionByMd5 = new OpenAPIHono().openapi(
  createRoute({
    method: "get",
    path: "/transaction/get-by-md5/{md5}",
    request: { params: z.object({ md5: z.string() }) },
    responses: {
      200: response({
        schema: z.object({ data: z.any() }),
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
