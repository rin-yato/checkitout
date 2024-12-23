import { z } from "zod";

export const fileUploadSchema = z.object({
  id: z.string(),
  userId: z.string(),

  name: z.string(),
  url: z.string(),
  hash: z.string(),
  type: z.string(),
  size: z.number().positive(),

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});
