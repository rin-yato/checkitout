import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { streamSSE } from "hono/streaming";
import { z } from "zod";
import { transactionQueue } from "../lib/queue";

export const trackTransaction = new OpenAPIHono().openapi(
  createRoute({
    path: "/transaction/track/{md5}",
    method: "get",
    request: { params: z.object({ md5: z.string() }) },
    responses: {
      200: { description: "Track a transaction" },
    },
  }),
  async (c) => {
    const md5 = c.req.param("md5");

    if (md5 === undefined) {
      return c.json({ error: "MD5 is required" }, 400);
    }

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
