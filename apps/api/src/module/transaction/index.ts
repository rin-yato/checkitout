import { OpenAPIHono } from "@hono/zod-openapi";

import { getTransactionByMd5V1 } from "./route/v1.get-by-md5";
import { trackTransactionV1 } from "./route/v1.track";

export const TransactionRoute = new OpenAPIHono()
  .route("/", trackTransactionV1)
  .route("/", getTransactionByMd5V1);
