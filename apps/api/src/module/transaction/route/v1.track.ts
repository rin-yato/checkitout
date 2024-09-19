import { z } from "zod";
import { streamSSE } from "hono/streaming";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";

import { transactionQueue } from "@/task/transaction";

export const trackTransactionV1 = new OpenAPIHono().openapi(
  createRoute({
    method: "get",
    path: "/v1/transaction/track/{md5}",
    tags: ["Transaction"],
    request: { params: z.object({ md5: z.string() }) },
    responses: {
      200: {
        description:
          "SSE for tracking transaction status, it will send back a status every 3 seconds.",
        content: {
          "text/plain": {
            schema: z.string().openapi({
              example: "PENDING | COMPLETED | FAILED",
              enum: ["PENDING", "COMPLETED", "FAILED"],
            }),
          },
        } as unknown as undefined,
      },
    },
  }),
  async (c) => {
    const md5 = c.req.param("md5");

    return streamSSE(
      c,
      async (stream) => {
        stream.onAbort(async () => {
          stream.abort();
          await stream.close();
        });

        while (true) {
          const job = await transactionQueue.queue.getJob(md5);
          const isCompleted = (await job?.isCompleted()) ?? false;
          const isFailed = (await job?.isFailed()) ?? false;

          if (isCompleted) {
            await stream.writeSSE({ data: "COMPLETED" });
            await stream.close();
          } else if (isFailed) {
            await stream.writeSSE({ data: "FAILED" });
            await stream.close();
          }

          await stream.writeSSE({ data: "PENDING" });
          await stream.sleep(3000);
        }
      },
      async (error, stream) => {
        await stream.writeln(`ERROR: ${error.message}`);
      },
    );
  },
);
