import { validateAuth } from "@/lib/auth";
import { fileUploadService } from "@/service/file-upload.service";
import type { AppEnv } from "@/setup/context";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const uploadFileV1 = new OpenAPIHono<AppEnv>().openapi(
  createRoute({
    method: "post",
    path: "/v1/upload",
    tags: ["File Upload"],
    description: "Upload a file",
    operationId: "Upload File",
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: z
              .object({ file: z.instanceof(File).openapi({ format: "file" }) })
              .required(),
          },
        },
      },
    },
    responses: {
      200: {
        description: "File uploaded successfully",
      },
    },
  }),
  async (c) => {
    const { user } = validateAuth(c);
    const { file } = c.req.valid("form");

    const fileUpload = await fileUploadService.uploadFile(file, user.id);

    return c.json(fileUpload.value);
  },
);
