// Validate ENV
import { env } from "@/lib/env";

import { TransactionTasker } from "@/module/transaction/lib/tasker";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Modules } from "./module";

import { registerTasker } from "./lib/tasker";
import { registerCors } from "./setup/cors";
import { registerOpenAPI } from "./setup/openapi";

const app = new OpenAPIHono();

// Register CORS
registerCors(app);

// Register OpenAPI docs
registerOpenAPI(app);

// Register taskers
registerTasker(app, [new TransactionTasker()]);

// Register modules
app.route("/", Modules);

export default { port: env.PORT, fetch: app.fetch };
