import { OpenAPIHono } from "@hono/zod-openapi";
import { findManyUserV1 } from "./route/v1.find-many";
import { updateUserV1 } from "./route/v1.update";

export const UserRoute = new OpenAPIHono().route("/", findManyUserV1).route("/", updateUserV1);
