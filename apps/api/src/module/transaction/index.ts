import { OpenAPIHono } from "@hono/zod-openapi";
import { createTransaction } from "./route/transaction.create";
import { getTransactionByMd5 } from "./route/transaction.get-by-md5";
import { trackTransaction } from "./route/transaction.track";

export const TransactionRoute = new OpenAPIHono()
  .route("/", createTransaction)
  .route("/", trackTransaction)
  .route("/", getTransactionByMd5);
