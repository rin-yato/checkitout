import { z } from "zod";

export const tokenSchema = z.object({
  token: z.string(),
  name: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type Token = z.infer<typeof tokenSchema>;
