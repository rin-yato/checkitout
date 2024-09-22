import { db, takeFirstOrThrow } from "@/lib/db";
import type { WebhookInsert } from "@repo/db/schema";
import { TB_webhook } from "@repo/db/table";

class WebhookService {
  async create(data: WebhookInsert) {
    return db.insert(TB_webhook).values(data).returning().then(takeFirstOrThrow);
  }
}

export const webhookService = new WebhookService();
