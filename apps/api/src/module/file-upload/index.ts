import { OpenAPIHono } from "@hono/zod-openapi";
import { uploadFileV1 } from "./route/v1.upload";

export const FileUploadRoute = new OpenAPIHono().route("/", uploadFileV1);
