import { db, takeFirstOrThrow } from "@/lib/db";
import { type Result, err, ok } from "@justmiracle/result";
import type { User, UserInsert, UserUpdate } from "@repo/db/schema";
import { TB_user } from "@repo/db/table";
import { eq } from "drizzle-orm";
import { TB_checkoutSequence } from "node_modules/@repo/db/src/table/checkout-sequence.table";

export class UserService {
  async findByGoogleId(googleId: string): Promise<Result<User | undefined>> {
    return db.query.TB_user.findFirst({
      where: eq(TB_user.googleId, googleId),
    })
      .execute()
      .then(ok)
      .catch(err);
  }

  async findById(id: string) {
    return db.query.TB_user.findFirst({
      where: eq(TB_user.id, id),
    })
      .execute()
      .then(ok)
      .catch(err);
  }

  async findMany() {
    return db.query.TB_user.findMany().execute().then(ok).catch(err);
  }

  async create(userInsert: UserInsert): Promise<Result<User>> {
    return db
      .transaction(async (tx) => {
        const user = await tx
          .insert(TB_user)
          .values(userInsert)
          .returning()
          .then(takeFirstOrThrow);
        await tx.insert(TB_checkoutSequence).values({ userId: user.id });
        return user;
      })
      .then(ok)
      .catch(err);
  }

  async update(id: string, userUpdate: UserUpdate) {
    return db
      .update(TB_user)
      .set({
        phone: userUpdate.phone,
        address: userUpdate.address,
        profile: userUpdate.profile,
        bakongId: userUpdate.bakongId,
        displayName: userUpdate.displayName,
        webhookUrl: userUpdate.webhookUrl,
        waitBeforeRedirect: userUpdate.waitBeforeRedirect,
      })
      .where(eq(TB_user.id, id))
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
  }

  async softDelete(id: string) {
    return db
      .update(TB_user)
      .set({ deletedAt: new Date() })
      .where(eq(TB_user.id, id))
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
  }
}

export const userService = new UserService();
