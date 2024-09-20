// Validate ENV
import { env } from "@/lib/env";

import { OpenAPIHono } from "@hono/zod-openapi";

import { Modules } from "@/module";
import { registerTasker } from "@/lib/tasker";
import { registerCors } from "@/setup/cors";
import { registerOpenAPI } from "@/setup/openapi";
import { registerTiming } from "@/setup/timing";
import { registerAuthMiddleware } from "@/setup/auth";
import type { AppEnv } from "@/setup/context";
import { TransactionTasker } from "@/task/transaction";
import { registerGlobalErrorHandler } from "./setup/error";
import { registerLogger } from "./setup/logger";
import { registerHeaderMiddleware } from "./setup/header";

const app = new OpenAPIHono<AppEnv>();

// Register headers middleware
registerHeaderMiddleware(app);

// Register CORS
registerCors(app);

// Register Timing
registerTiming(app);

// Register global error handler
registerGlobalErrorHandler(app);

// Register taskers
registerTasker(app, [new TransactionTasker()]);

// Register Auth middleware
registerAuthMiddleware(app);

// Register Logger
registerLogger(app);

// Register OpenAPI docs
registerOpenAPI(app);

// Register modules
app.route("/", Modules);

export default { port: env.PORT, fetch: app.fetch };
