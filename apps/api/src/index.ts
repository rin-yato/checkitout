// Validate ENV
import { env } from "@/lib/env";

import { TransactionTasker } from "@/module/transaction/lib/tasker";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Modules } from "./module";

import { registerTasker } from "./lib/tasker";
import { registerCors } from "./setup/cors";
import { registerOpenAPI } from "./setup/openapi";
import { registerTiming } from "./setup/timing";
import { registerAuthMiddleware } from "./setup/auth";
import type { Context } from "./setup/context";

const app = new OpenAPIHono<Context>();

// Register CORS
registerCors(app);

// Register Timing
registerTiming(app);

// Register OpenAPI docs
registerOpenAPI(app);

// Register taskers
registerTasker(app, [new TransactionTasker()]);

// Register Auth middleware
registerAuthMiddleware(app);

// Register modules
app.route("/", Modules);

export default { port: env.PORT, fetch: app.fetch };
