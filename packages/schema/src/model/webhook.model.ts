import { z } from "zod";

export const webhookSchema = z.object({
  id: z.string(),
  userId: z.string(),
  checkoutId: z.string(),
  status: z.number(),
  json: z.unknown(),
  createdAt: z.date(),
});

export type Webhook = z.infer<typeof webhookSchema>;
