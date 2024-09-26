import type { z } from "zod";
import { userSchema } from "../model";
import { fileUploadSchema } from "../model/file-upload.model";

export const authMeResponse = userSchema
  .extend({
    profile: fileUploadSchema.omit({ deletedAt: true }).nullable(),
  })
  .omit({ deletedAt: true });

export type AuthMeResponse = z.infer<typeof authMeResponse>;
