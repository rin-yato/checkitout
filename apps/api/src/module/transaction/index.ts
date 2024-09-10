import { OpenAPIHono } from "@hono/zod-openapi";

import { getTransactionByMd5 } from "./route/transaction.get-by-md5";
import { trackTransaction } from "./route/transaction.track";

export const TransactionRoute = new OpenAPIHono()
  .route("/", trackTransaction)
  .route("/", getTransactionByMd5);
