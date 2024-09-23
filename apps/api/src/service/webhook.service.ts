import { db, takeFirstOrThrow } from "@/lib/db";
import { err, ok } from "@justmiracle/result";
import type { WebhookInsert } from "@repo/db/schema";
import { TB_webhook } from "@repo/db/table";

class WebhookService {
  async create(data: WebhookInsert) {
    return db
      .insert(TB_webhook)
      .values(data)
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
  }
}

export const webhookService = new WebhookService();
