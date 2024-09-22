import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TB_webhook } from "../table";
import { z } from "zod";

export const webhookSchema = createSelectSchema(TB_webhook, {
  json: z.record(z.unknown()).optional(),
});

export const webhookInsert = createInsertSchema(TB_webhook, {
  json: z.record(z.unknown()).optional(),
});

export type WebhookInsert = z.infer<typeof webhookInsert>;
export type Webhook = z.infer<typeof webhookSchema>;
