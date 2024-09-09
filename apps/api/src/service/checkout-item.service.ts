import { db, takeFirstOrThrow } from "@/lib/db";
import { err, ok } from "@justmiracle/result";
import type { CheckoutItemInsert, CheckoutItemUpdate } from "@repo/db/schema";
import { TB_checkoutItem } from "@repo/db/table";
import { eq } from "drizzle-orm";

export class CheckoutItemService {
  async findById(id: string) {
    return db.query.TB_checkoutItem.findFirst({
      where: eq(TB_checkoutItem.id, id),
    })
      .then(ok)
      .catch(err);
  }

  async findMany() {
    return db.query.TB_checkoutItem.findMany().then(ok).catch(err);
  }

  async create(checkoutItemInsert: CheckoutItemInsert) {
    return db
      .insert(TB_checkoutItem)
      .values(checkoutItemInsert)
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
  }

  async update(id: string, checkoutItemUpdate: CheckoutItemUpdate) {
    return db
      .update(TB_checkoutItem)
      .set(checkoutItemUpdate)
      .where(eq(TB_checkoutItem.id, id))
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
  }
}

export const checkoutItemService = new CheckoutItemService();
