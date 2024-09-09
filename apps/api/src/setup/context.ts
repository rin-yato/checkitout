import type { TimingVariables } from "hono/timing";
import type { Auth } from "./auth";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";

export type Variables = TimingVariables & Auth;

export interface AppEnv {
  Variables: Variables;
}

export type App = OpenAPIHono<AppEnv>;
export type AppContext = Context<AppEnv>;
