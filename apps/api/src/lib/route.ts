import { OpenAPIHono } from "@hono/zod-openapi";
import type { ZodSchema } from "zod";

export const createRoute: OpenAPIHono["openapi"] = (routeConfig, handler) => {
  return new OpenAPIHono().openapi(routeConfig, handler);
};

export interface ResponseConfig {
  schema: ZodSchema;
  description: string;
  example?: any;
}

export function response(config: ResponseConfig) {
  return {
    content: {
      "application/json": { schema: config.schema, example: config.example },
    },
    description: config.description,
  };
}
